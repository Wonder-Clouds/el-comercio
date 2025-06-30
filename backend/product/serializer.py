from rest_framework import serializers
from .models import Product


class ProductSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'type', 'returns_date', 'product_price', 'status_product', 'total_quantity']
