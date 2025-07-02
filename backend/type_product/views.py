from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django_filters.rest_framework import DjangoFilterBackend

from .models import TypeProduct
from .serializer import TypeProductSerializer
from .filters import TypeProductFilter
from core.pagination import CustomPagination


# Create your views here.
class TypeProductViewSet(viewsets.ModelViewSet):

    # JWT authentication 
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    queryset = TypeProduct.objects.all()
    serializer_class = TypeProductSerializer
    pagination_class = CustomPagination

    # Setttings of filters 
    filter_backends = [DjangoFilterBackend]
    filterset_class = TypeProductFilter
