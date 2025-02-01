from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend

from core.pagination import CustomPagination
from .models import Product
from .serializer import ProductSerializer
from .filters import ProductFilter

# Create your views here.
class ProductViewSet(viewsets.ModelViewSet):
    # JWT Authentication
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    queryset = Product.objects.filter(delete_at__isnull=True)
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