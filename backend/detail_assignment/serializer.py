from rest_framework import serializers
from assignment.serializer import AssignmentSerializer
from product.models import Product
from product.serializer import ProductSerializer
from assignment.models import Assignment
from product_price.models import ProductPrice
from .models import DetailAssignment

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

    def validate(self, data):
        product_id = data.get('product')

        try:
            product_price = ProductPrice.objects.get(product=product_id)
            data['unit_price'] = product_price.price
        except ProductPrice.DoesNotExist:
            raise serializers.ValidationError({'error': 'ProductPrice matching query does not exist.'})

        return data

    def create(self, validated_data):
        assignment = validated_data.pop('assignment')
        product = validated_data.pop('product')

        detail_assignment = DetailAssignment.objects.create(
            assignment=assignment,
            product=product,
            **validated_data
        )

        return detail_assignment