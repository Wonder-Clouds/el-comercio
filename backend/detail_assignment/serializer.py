from rest_framework import serializers
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
    returned_amount = serializers.IntegerField(required=False)
    date_assignment = serializers.SerializerMethodField()
    seller_name = serializers.SerializerMethodField()
    seller_last_name = serializers.SerializerMethodField()
    seller_code = serializers.SerializerMethodField()

    class Meta:
        """
        Meta class for DetailAssignmentSerializer.
        """
        model = DetailAssignment
        fields = ['id', 'assignment_id', 'product', 'product_id', 'quantity', 'returned_amount', 'unit_price', 'status',
                  'date_assignment', 'seller_name', 'seller_last_name', 'seller_code', 'return_date']
        read_only_fields = ['return_date']

    def get_date_assignment(self, obj):
        """
        Get the date_assignment from the related Assignment.

        Args:
            obj: The object instance.

        Returns:
            date: The date_assignment of the related Assignment.
        """
        return obj.assignment.date_assignment

    def get_seller_name(self, obj):
        """
        Get the seller's name from the related Assignment.

        Args:
            obj: The object instance.

        Returns:
            str: The seller's name.
        """
        return obj.assignment.seller.name

    def get_seller_last_name(self, obj):
        """
        Get the seller's last name from the related Assignment.

        Args:
            obj: The object instance.

        Returns:
            str: The seller's last name.
        """
        return obj.assignment.seller.last_name

    def get_seller_code(self, obj):
        """
        Get the seller's code from the related Assignment.

        Args:
            obj: The object instance.

        Returns:
            str: The seller's code.
        """
        return obj.assignment.seller.number_seller

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

        unit_price = product.product_price

        detail_assignment, created = DetailAssignment.objects.get_or_create(
            assignment=assignment,
            product=product,
            defaults={
                'unit_price': unit_price,
                **validated_data
            }
        )

        if created and not detail_assignment.return_date:
            detail_assignment.return_date = (
                datetime.datetime.now().date() + datetime.timedelta(days=product.returns_date)
            )
            detail_assignment.save()

        return detail_assignment