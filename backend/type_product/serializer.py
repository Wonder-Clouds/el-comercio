from rest_framework import serializers
from .models import TypeProduct


class TypeProductSerializer(serializers.ModelSerializer):
    """
    Serializer for the class Type Product
    """

    class Meta:
        model = TypeProduct
        fields = ['id', 'name']
