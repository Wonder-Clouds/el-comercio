from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'type', 'returns_date', 'monday_price', 'tuesday_price', 'wednesday_price', 'thursday_price', 'friday_price', 'saturday_price', 'sunday_price', 'product_price', 'status_product',
                  'friday_price', 'saturday_price', 'sunday_price', 'product_price', 'status_product']
