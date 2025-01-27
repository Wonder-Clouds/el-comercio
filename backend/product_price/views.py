from rest_framework import viewsets, status
from rest_framework.decorators import action

from core.pagination import CustomPagination
from .models import ProductPrice
from .serializer import ProductPriceSerializer
from rest_framework.response import Response

# Create your views here.
class ProductPriceViewSet(viewsets.ModelViewSet):
    queryset = ProductPrice.objects.filter(delete_at__isnull=True)
    serializer_class = ProductPriceSerializer
    pagination_class = CustomPagination

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.soft_delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['get'], url_path='is-current')
    def is_current(self, request, pk=None):
        product_price = self.get_object()
        if product_price.end_date is not None:
            return Response({
                'message': 'This price is not current'
            }, status=status.HTTP_404_NOT_FOUND)
        return Response({
            'message': 'This price is current'
        }, status=status.HTTP_200_OK)