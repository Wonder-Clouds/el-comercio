from rest_framework import serializers
from assignment.serializer import AssignmentSerializer
from product.models import Product
from product.serializer import ProductSerializer
from assignment.models import Assignment
from .models import DetailAssignment
import datetime

class DetailAssignmentSerializer(serializers.ModelSerializer):
    """
    Serializer for DetailAssignment model.
    """

    assignment_id = serializers.PrimaryKeyRelatedField(
        queryset=Assignment.objects.all(), source='assignment', write_only=True
    )
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), source='product', write_only=True
    )
    returned_amount = serializers.IntegerField(required=False, read_only=True)

    class Meta:
        """
        Meta class for DetailAssignmentSerializer.
        """
        model = DetailAssignment
        fields = ['id', 'assignment_id', 'product', 'product_id', 'quantity', 'returned_amount', 'unit_price', 'status']

    def get_assignment(self, obj):
        """
        Get the assignment data for the given object.

        Args:
            obj: The object instance.

        Returns:
            dict: Serialized assignment data.
        """
        return AssignmentSerializer(obj.assignment).data

    def create(self, validated_data):
        """
        Create a new DetailAssignment instance.

        Args:
            validated_data (dict): Validated data for creating the instance.

        Returns:
            DetailAssignment: The created DetailAssignment instance.
        """
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