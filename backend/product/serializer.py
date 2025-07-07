from rest_framework import serializers
from .models import Product
from type_product.serializer import TypeProductSerializer


class ProductSerializer(serializers.ModelSerializer):
    type_product_detail = TypeProductSerializer(source='type_product', read_only=True)
    
    class Meta:
        model = Product
        fields = ['id', 'name', 'type_product', 'type_product_detail', 'returns_date', 'product_price', 'status_product', 'total_quantity']
        extra_kwargs = {
            'type_product': {'write_only': True} 
        }

    def to_representation(self, instance):
        """Instead of displaying only the ID, display the complete information."""
        representation = super().to_representation(instance)
        
        if instance.type_product:
            representation['type_product'] = {
                'id': instance.type_product.id,
                'name': instance.type_product.name
            }
        
        representation.pop('type_product_detail', None)
        
        return representation
