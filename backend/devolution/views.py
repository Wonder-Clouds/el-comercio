from rest_framework import viewsets, status
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

from core.pagination import CustomPagination
from detail_assignment.models import DetailAssignment
from devolution.models import Devolution
from devolution.serializer import DevolutionSerializer
from rest_framework.response import Response
from rest_framework.decorators import action

# Create your views here.
class DevolutionViewSet(viewsets.ModelViewSet):
    # JWT Authentication
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    queryset = Devolution.objects.filter(delete_at__isnull=True)
    serializer_class = DevolutionSerializer
    pagination_class = CustomPagination

    # Delete Method
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.soft_delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['post'], url_path='register-devolution')
    def register_devolution(self, request, pk=None):
        assignment_detail_id = pk
        quantity = request.data.get('quantity')
        devolution_date = timezone.now().date()
        try:
            detail_assignment = DetailAssignment.objects.get(pk=assignment_detail_id)
        except DetailAssignment.DoesNotExist:
            return Response({'message': 'Detail Assignment not found'}, status=status.HTTP_404_NOT_FOUND)

        if quantity > detail_assignment.quantity:
            return Response({'message': 'Quantity to return is greater than the quantity assigned'}, status=status.HTTP_400_BAD_REQUEST)

        if devolution_date < detail_assignment.assignment.date_assignment:

            return Response({'message': 'Devolution date is less than the assignment date'}, status=status.HTTP_400_BAD_REQUEST)

        if detail_assignment.returned_amount + quantity > detail_assignment.quantity:
            return Response({'message': 'The quantity returned is greater than the quantity assigned'}, status=status.HTTP_400_BAD_REQUEST)

        detail_assignment.returned_amount += quantity
        detail_assignment.save()

        Devolution.objects.create(
            detail_assignment=detail_assignment,
            quantity=quantity,
            devolution_date=devolution_date
        )

        return Response({'message': 'Devolution registered successfully'}, status=status.HTTP_201_CREATED)
