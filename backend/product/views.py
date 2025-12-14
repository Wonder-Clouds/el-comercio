from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend

from core.pagination import CustomPagination
from core.cache_mixin import CacheMixin
from .models import Product
from .serializer import ProductSerializer
from .filters import ProductFilter
from datetime import date

# Create your views here.
class ProductViewSet(CacheMixin, viewsets.ModelViewSet):
    # Cache configuration
    cache_key_prefix = 'products'
    cache_timeout = 3600

    # JWT Authentication
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    pagination_class = CustomPagination
    filter_backends = [DjangoFilterBackend]
    filterset_class = ProductFilter

    # Delete Method
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.soft_delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    # Custom action to list products with status_product set to False
    @action(detail=False, methods=['get'], url_path='inactive-products')
    def inactive_products(self, request):
        inactive_products = Product.objects.filter(status_product=False, delete_at__isnull=True)
        page = self.paginate_queryset(inactive_products)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(inactive_products, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], url_path='by-date')
    def products_by_date(self, request):
        date_str = request.query_params.get('date')  # ?date=2025-07-07
        product_type = request.query_params.get('product_type')  # ?product_type=GESTION

        if not date_str:
            return Response({'error': 'El parámetro "date" es requerido.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            query_date = date.fromisoformat(date_str)
        except ValueError:
            return Response({'error': 'Formato de fecha inválido. Usa YYYY-MM-DD.'}, status=status.HTTP_400_BAD_REQUEST)

        # Primero filtramos por fecha y productos no eliminados
        products = Product.objects.filter(create_at__date=query_date, delete_at__isnull=True)

        # Si se envía el filtro de tipo, lo aplicamos
        if product_type:
            products = products.filter(type_product__type__iexact=product_type)

        page = self.paginate_queryset(products)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)
