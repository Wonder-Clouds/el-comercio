from rest_framework import viewsets
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

from core.pagination import CustomPagination
from detail_assignment.models import DetailAssignment
from detail_assignment.serializer import DetailAssignmentSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
import datetime

from product.models import Product


# Create your views here.
class DetailAssignmentViewSet(viewsets.ModelViewSet):
    # JWT Authentication
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    queryset = DetailAssignment.objects.all()
    serializer_class = DetailAssignmentSerializer
    pagination_class = CustomPagination

    def calculate_sub_total(self, detail_assignment):
        sub_total = detail_assignment.unit_price * detail_assignment.quantity
        return sub_total

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        product_id = data.get('product_id')
        assignment_id = data.get('assignment_id')

        try:
            product = Product.objects.get(id=product_id)
            current_day = datetime.datetime.now().strftime('%A').lower()

            if product.type == 'PRODUCT':
                data['unit_price'] = product.product_price
            elif product.type == 'NEWSPAPER':
                data['unit_price'] = getattr(product, f'{current_day}_price')
        except Product.DoesNotExist:
            return Response({'error': 'Product matching query does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            detail_assignment = DetailAssignment.objects.get(assignment_id=assignment_id, product_id=product_id)
            detail_assignment.quantity = int(data.get('quantity', 0))
            detail_assignment.save()
            serializer = self.get_serializer(detail_assignment)
        except DetailAssignment.DoesNotExist:
            serializer = self.get_serializer(data=data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.soft_delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['get'], url_path='calculate-sub-total')
    def get_sub_total_action(self, request, pk=None):
        detail_assignment = self.get_object()
        sub_total = self.calculate_sub_total(detail_assignment)

        return Response({
            'detail_assignment': detail_assignment.id,
            'product': detail_assignment.product.name,
            'quantity': detail_assignment.quantity,
            'unit_price': detail_assignment.unit_price,
            'sub_total': sub_total
        }, status=status.HTTP_200_OK)