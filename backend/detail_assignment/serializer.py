from rest_framework import serializers
from product.models import Product
from product.serializer import ProductSerializer
from assignment.models import Assignment
from assignment.serializer import AssignmentSerializer
from .models import DetailAssignment

class DetailAssignmentSerializer(serializers.ModelSerializer):
    assignment = AssignmentSerializer(read_only=True)
    assignment_id = serializers.PrimaryKeyRelatedField(
        queryset=Assignment.objects.all(), write_only=True
    )

    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), write_only=True
    )

    class Meta:
        model = DetailAssignment
        fields = ['id', 'assignment', 'assignment_id', 'product', 'product_id', 'quantity', 'returned_amount',
                  'unit_price']
