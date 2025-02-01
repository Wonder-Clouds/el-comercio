from rest_framework import serializers
from assignment.serializer import AssignmentSerializer
from product.models import Product
from product.serializer import ProductSerializer
from assignment.models import Assignment
from .models import DetailAssignment
import datetime

class DetailAssignmentSerializer(serializers.ModelSerializer):
    assignment_id = serializers.PrimaryKeyRelatedField(
        queryset=Assignment.objects.all(), source='assignment', write_only=True
    )
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), source='product', write_only=True
    )
    returned_amount = serializers.IntegerField(required=False, read_only=True)

    class Meta:
        model = DetailAssignment
        fields = ['id', 'assignment_id', 'product', 'product_id', 'quantity', 'returned_amount', 'unit_price']

    def get_assignment(self, obj):
        return AssignmentSerializer(obj.assignment).data

    def create(self, validated_data):
        assignment = validated_data.pop('assignment')
        product = validated_data.pop('product')

        current_day = datetime.datetime.now().strftime('%A').lower()

        if product.type == 'PRODUCT':
            unit_price = product.product_price
        elif product.type == 'NEWSPAPER':
            unit_price = getattr(product, f'{current_day}_price')

        detail_assignment = DetailAssignment.objects.create(
            assignment=assignment,
            product=product,
            unit_price=unit_price,
            **validated_data
        )

        return detail_assignment