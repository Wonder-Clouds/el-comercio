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

    def list(self, request, *args, **kwargs):
        # Names of types of products
        type_products = ['TROME', 'COMERCIO', 'GESTION', 'PERU 21', 'OJO']

        producto_obj, created = TypeProduct.objects.get_or_create(name='PRODUCTO')
        if producto_obj.type != 'PRODUCT':
            producto_obj.type = 'PRODUCT'
            producto_obj.save()
            
        # Verify and create the names of type products
        for name in type_products:
            obj, created = TypeProduct.objects.get_or_create(name=name)
            if obj.type != 'NEWSPAPER':
                obj.type = 'NEWSPAPER'
                obj.save()
        
        #$ Continue with the method list
        return super().list(request, *args, **kwargs)
