from rest_framework import serializers
from .models import Yape


class YapeSerializer(serializers.ModelSerializer):
    """
    Serializer for the Yape model.
    """

    class Meta:
        model = Yape
        fields = ['id', 'name', 'amount', 'date_yape', 'operation_code']
    
