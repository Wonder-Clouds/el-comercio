from rest_framework import serializers
from .models import TypeProduct

class TypeProductSerializer(serializers.ModelSerializer):
    """
    Serializer for the class Type Product
    """

    class Meta:
        model = TypeProduct
        fields = [
            'id', 'name', 'type', 
            'monday_price', 'tuesday_price', 'wednesday_price', 
            'thursday_price', 'friday_price', 'saturday_price', 
            'sunday_price'
        ]
