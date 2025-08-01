from rest_framework import serializers
from datetime import datetime
from .models import Product
from type_product.serializer import TypeProductSerializer


class ProductSerializer(serializers.ModelSerializer):
    type_product_detail = TypeProductSerializer(source='type_product', read_only=True)
    current_day_price = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'type_product', 'type_product_detail', 
            'returns_date', 'product_price', 'status_product', 
            'total_quantity', 'current_day_price'
        ]
        extra_kwargs = {
            'type_product': {'write_only': True} 
        }

    def get_current_day_price(self, obj):
        """Get the price for the current day from type_product"""
        if not obj.type_product:
            return None
        
        current_day = datetime.now().strftime('%A').lower()
        day_mapping = {
            'monday': obj.type_product.monday_price,
            'tuesday': obj.type_product.tuesday_price,
            'wednesday': obj.type_product.wednesday_price,
            'thursday': obj.type_product.thursday_price,
            'friday': obj.type_product.friday_price,
            'saturday': obj.type_product.saturday_price,
            'sunday': obj.type_product.sunday_price,
        }
        
        return day_mapping.get(current_day)

    def to_representation(self, instance):
        """Instead of displaying only the ID, display the complete information."""
        representation = super().to_representation(instance)
        
        if instance.type_product:
            representation['type_product'] = {
                'id': instance.type_product.id,
                'name': instance.type_product.name,
                'type': instance.type_product.type,
                'monday_price': instance.type_product.monday_price,
                'tuesday_price': instance.type_product.tuesday_price,
                'wednesday_price': instance.type_product.wednesday_price,
                'thursday_price': instance.type_product.thursday_price,
                'friday_price': instance.type_product.friday_price,
                'saturday_price': instance.type_product.saturday_price,
                'sunday_price': instance.type_product.sunday_price,
            }
        
        representation.pop('type_product_detail', None)
        
        return representation
