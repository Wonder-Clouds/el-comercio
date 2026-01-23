from rest_framework import serializers
from seller.models import Seller
from seller.serializer import SellerSerializer
from .models import Assignment
from rest_framework.exceptions import ValidationError
from product.models import Product


class AssignmentSerializer(serializers.HyperlinkedModelSerializer):
    """
    Serializer for the Assignment model.
    """

    seller = SellerSerializer(read_only=True)
    seller_id = serializers.PrimaryKeyRelatedField(
        queryset=Seller.objects.all(), write_only=True
    )
    detail_assignments = serializers.SerializerMethodField()
    products = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Product.objects.all(), write_only=True, required=False
    )

    class Meta:
        model = Assignment
        fields = ['id', 'seller_id', 'seller', 'date_assignment', 'detail_assignments', 'products']

    def create(self, validated_data):
        """
        Create a new Assignment instance.

        Args:
            validated_data (dict): Validated data for creating the Assignment.

        Returns:
            Assignment: The created Assignment instance.
        """
        seller = validated_data.pop('seller_id')
        products = validated_data.pop('products', [])
        assignment = Assignment.objects.create(seller=seller, **validated_data)
        if products:
            assignment.products.set(products)
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
        products = validated_data.pop('products', None)
        
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
        
        if products is not None:
            instance.products.set(products)
        
        instance.save()
        return instance

    def get_detail_assignments(self, obj):
        """
        Get detailed assignments related to the Assignment instance.
        Filters by product_type if provided in request query params.

        Args:
            obj (Assignment): The Assignment instance.

        Returns:
            list: List of detailed assignments.
        """
        from detail_assignment.serializer import DetailAssignmentSerializer

        # Get all detail assignments
        detail_assignments = obj.detailassignment_set.all()

        # Filter by product_type if provided in request context
        request = self.context.get('request')
        if request and hasattr(request, 'query_params'):
            product_type = request.query_params.get('product_type')
            if product_type:
                # Filter detail assignments by product type
                detail_assignments = detail_assignments.filter(
                    product__type_product__type__iexact=product_type
                )

        return DetailAssignmentSerializer(detail_assignments, many=True).data

    def to_representation(self, instance):
        """
        Override to_representation to show product details in read response
        while still accepting product IDs for write operations.
        Filters products by product_type if provided in request query params.
        """
        representation = super().to_representation(instance)
        from product.serializer import ProductSerializer

        # Get all products
        products = instance.products.all()

        # Filter by product_type if provided in request context
        request = self.context.get('request')
        if request and hasattr(request, 'query_params'):
            product_type = request.query_params.get('product_type')
            if product_type:
                # Filter products by type
                products = products.filter(type_product__type__iexact=product_type)

        # Replace products IDs with full product details (filtered)
        representation['products'] = ProductSerializer(products, many=True).data
        return representation