from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, status
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

from core.pagination import CustomPagination
from core.cache_mixin import CacheMixin
from detail_assignment.models import DetailAssignment
from devolution.filters import DevolutionFilter
from devolution.models import Devolution
from devolution.serializer import DevolutionSerializer
from rest_framework.response import Response
from rest_framework.decorators import action

class DevolutionViewSet(CacheMixin, viewsets.ModelViewSet):
    # Cache configuration
    cache_key_prefix = 'devolutions'
    cache_timeout = 3600

    # JWT Authentication
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    queryset = Devolution.objects.all()
    serializer_class = DevolutionSerializer
    pagination_class = CustomPagination
    filter_backends = [DjangoFilterBackend]
    filterset_class = DevolutionFilter

    # Delete Method
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        detail_assignment = instance.detail_assignment
        detail_assignment.returned_amount -= instance.quantity
        detail_assignment.save()
        instance.soft_delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['post'], url_path='(?P<detail_assignment_id>[^/.]+)/register-devolution')
    def register_devolution(self, request, detail_assignment_id=None):
        quantity = request.data.get('quantity')
        devolution_date = timezone.now().date()
        try:
            detail_assignment = DetailAssignment.objects.get(pk=detail_assignment_id)
        except DetailAssignment.DoesNotExist:
            return Response({'message': 'Detail Assignment not found'}, status=status.HTTP_404_NOT_FOUND)

        if quantity > detail_assignment.quantity:
            return Response({'message': 'Quantity to return is greater than the quantity assigned'},
                            status=status.HTTP_400_BAD_REQUEST)

        if devolution_date < detail_assignment.assignment.date_assignment:
            return Response({'message': 'Devolution date is less than the assignment date'},
                            status=status.HTTP_400_BAD_REQUEST)

        if detail_assignment.returned_amount + quantity > detail_assignment.quantity:
            return Response({'message': 'The quantity returned is greater than the quantity assigned'},
                            status=status.HTTP_400_BAD_REQUEST)

        detail_assignment.returned_amount += quantity
        detail_assignment.save()

        devolution = Devolution.objects.create(
            detail_assignment=detail_assignment,
            quantity=quantity,
            devolution_date=devolution_date
        )

        serializer = DevolutionSerializer(devolution)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'], url_path='detail-assignment-devolutions/(?P<detail_assignment_id>[^/.]+)')
    def detail_assignment_devolutions(self, request, detail_assignment_id=None):
        devolutions = Devolution.objects.filter(detail_assignment_id=detail_assignment_id, delete_at__isnull=True)
        page = self.paginate_queryset(devolutions)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(devolutions, many=True)
        return Response(serializer.data)