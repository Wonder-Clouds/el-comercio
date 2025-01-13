from rest_framework import viewsets, status
from rest_framework.decorators import action
from django.utils import timezone

from core.pagination import CustomPagination
from product_price.models import ProductPrice
from .models import Product
from .serializer import ProductSerializer
from rest_framework.response import Response

# Create your views here.
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.filter(delete_at__isnull=True)
    serializer_class = ProductSerializer
    pagination_class = CustomPagination

    # Delete Method
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.selft_delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


    @action(detail=True, methods=['get'], url_path='get_actual_price')
    def get_actual_price(self, request, pk=None):
        product = self.get_object()

        DAYS_OF_WEEK = {
            0: 'MONDAY',
            1: 'TUESDAY',
            2: 'WEDNESDAY',
            3: 'THURSDAY',
            4: 'FRIDAY',
            5: 'SATURDAY',
            6: 'SUNDAY'
        }

        try:
            today =  DAYS_OF_WEEK.get(timezone.now().date().weekday())
        except ProductPrice.DoesNotExist:
            return Response({
                'message': 'Day not found'
            }, status=status.HTTP_404_NOT_FOUND)

        try:
            product_price = ProductPrice.objects.get(product=product, day_week=today)
            return Response({
                'product': product.name,
                'price': product_price.price
            }, status=status.HTTP_200_OK)
        except ProductPrice.DoesNotExist:
            return Response({
                'message': 'Price not found'
            }, status=status.HTTP_404_NOT_FOUND)