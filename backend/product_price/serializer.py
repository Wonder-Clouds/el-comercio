from rest_framework import serializers
from .models import ProductPrice
from product.serializer import ProductSerializer

class ProductPriceSerializer(serializers.HyperlinkedModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = ProductPrice
        fields = ['id', 'product', 'price', 'day_week', 'price', 'start_date', 'end_date']