from rest_framework import viewsets
from .models import ProductPrice
from .serializer import  ProductPriceSerializer

# Create your views here.
class ProductPriceViewSet(viewsets.ModelViewSet):
    queryset = ProductPrice.objects.all()
    serializer_class = ProductPriceSerializer