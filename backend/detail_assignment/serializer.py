from rest_framework import serializers
from assignment.serializer import AssignmentSerializer
from product.serializer import  ProductSerializer
from .models import DetailAssignment

class DetailAssignmentSerializer(serializers.HyperlinkedModelSerializer):
    assignment = AssignmentSerializer(read_only=True)
    product = ProductSerializer(read_only=True)

    class Meta:
        model = DetailAssignment
        fields = ['id', 'assignment', 'product', 'quantity', 'returned_amount', 'unit_price']