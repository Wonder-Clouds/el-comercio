from rest_framework import viewsets
from rest_framework import status

from core.pagination import CustomPagination
from detail_assignment.models import DetailAssignment
from detail_assignment.serializer import DetailAssignmentSerializer
from rest_framework.decorators import action
from product_price.models import ProductPrice
from rest_framework.response import Response

# Create your views here.
class DetailAssignmentViewSet(viewsets.ModelViewSet):
    queryset = DetailAssignment.objects.filter(delete_at__isnull=True)
    serializer_class = DetailAssignmentSerializer
    pagination_class = CustomPagination

    def calculate_sub_total(self, detail_assignment):
        try:
            product_price = ProductPrice.objects.get(product=detail_assignment.product)
            sub_total = product_price.price * detail_assignment.quantity
            return sub_total
        except ProductPrice.DoesNotExist:
            return Response({'error': 'ProductPrice matching query does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        product_id = data.get('product_id')
        print(product_id)

        try:
            product_price = ProductPrice.objects.get(product=product_id)
            data['unit_price'] = product_price.price
        except ProductPrice.DoesNotExist:
            return Response({'error': 'ProductPrice matching query does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

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
