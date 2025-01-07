from rest_framework import viewsets
from seller.models import Seller
from seller.serializer import SellerSerializer


# Create your views here.
class SellerViewSet(viewsets.ModelViewSet):
    queryset = Seller.objects.all()
    serializer_class = SellerSerializer
