from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.db.models import Q

from core.pagination import CustomPagination
from detail_assignment.models import DetailAssignment
from detail_assignment.serializer import DetailAssignmentSerializer
from seller.models import Seller
from seller.serializer import SellerSerializer

class SellerViewSet(viewsets.ModelViewSet):
    # JWT Authentication
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    queryset = Seller.objects.all()
    serializer_class = SellerSerializer
    pagination_class = CustomPagination

    def get_queryset(self):
        queryset = super().get_queryset()
        search = self.request.query_params.get('search', None)

        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(last_name__icontains=search) |
                Q(dni__icontains=search) |
                Q(number_seller__icontains=search)
            ).distinct()

        return queryset.filter(delete_at__isnull=True)

    # Delete Method
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.soft_delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['get'], url_path='unpaid-assignment')
    def unpaid_assignment(self, request):
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        if start_date and end_date:
            detail_assignments = DetailAssignment.objects.filter(
                status='PENDING',
                assignment__date_assignment__range=[start_date, end_date]
            )
        else:
            detail_assignments = DetailAssignment.objects.filter(
                status='PENDING'
            )

        serializer = DetailAssignmentSerializer(detail_assignments, many=True)
        return Response(serializer.data)