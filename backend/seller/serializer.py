from rest_framework import serializers
from .models import Seller

class SellerSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Seller
        fields = ['id', 'name', 'last_name', 'dni', 'phone', 'number_seller']
