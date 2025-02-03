from rest_framework import serializers
from seller.models import Seller
from seller.serializer import SellerSerializer
from .models import Assignment
from rest_framework.exceptions import ValidationError


class AssignmentSerializer(serializers.HyperlinkedModelSerializer):
    """
    Serializer for the Assignment model.
    """

    seller = SellerSerializer(read_only=True)
    seller_id = serializers.PrimaryKeyRelatedField(
        queryset=Seller.objects.all(), write_only=True
    )
    detail_assignments = serializers.SerializerMethodField()

    class Meta:
        model = Assignment
        fields = ['id', 'seller_id', 'seller', 'date_assignment', 'status', 'detail_assignments']

    def create(self, validated_data):
        """
        Create a new Assignment instance.

        Args:
            validated_data (dict): Validated data for creating the Assignment.

        Returns:
            Assignment: The created Assignment instance.
        """
        seller = validated_data.pop('seller_id')
        assignment = Assignment.objects.create(seller=seller, **validated_data)
        return assignment

    def update(self, instance, validated_data):
        """
        Update an existing Assignment instance.

        Args:
            instance (Assignment): The existing Assignment instance.
            validated_data (dict): Validated data for updating the Assignment.

        Returns:
            Assignment: The updated Assignment instance.
        """
        seller_id = validated_data.pop('seller_id', None)
        if seller_id:
            if isinstance(seller_id, Seller):
                seller_id = seller_id.id
            try:
                seller = Seller.objects.get(id=seller_id)
                instance.seller = seller
            except Seller.DoesNotExist:
                raise ValidationError({'seller_id': 'The Seller does not exist.'})

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

    def get_detail_assignments(self, obj):
        """
        Get detailed assignments related to the Assignment instance.

        Args:
            obj (Assignment): The Assignment instance.

        Returns:
            list: List of detailed assignments.
        """
        from detail_assignment.serializer import DetailAssignmentSerializer
        return DetailAssignmentSerializer(obj.detailassignment_set.all(), many=True).data