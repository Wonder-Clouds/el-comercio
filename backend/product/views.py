from rest_framework import viewsets, status
from rest_framework.decorators import action
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

from core.pagination import CustomPagination
from .models import Product
from .serializer import ProductSerializer
from rest_framework.response import Response

# Create your views here.
class ProductViewSet(viewsets.ModelViewSet):
    # JWT Authentication
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    queryset = Product.objects.filter(delete_at__isnull=True)
    serializer_class = ProductSerializer
    pagination_class = CustomPagination

    # Delete Method
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.selft_delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
