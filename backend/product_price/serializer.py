from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from product.models import Product
from .models import ProductPrice
from product.serializer import ProductSerializer

class ProductPriceSerializer(serializers.HyperlinkedModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), write_only=True
    )

    class Meta:
        model = ProductPrice
        fields = ['id', 'product', 'product_id', 'price', 'day_week', 'price', 'start_date', 'end_date']

    def create(self, validated_data):
        product = validated_data.pop('product_id')
        product_price = ProductPrice.objects.create(product=product, **validated_data)
        return product_price

    def update(self, instance, validated_data):
        product_id = validated_data.pop('product_id', None)
        if product_id:
            if isinstance(product_id, Product):
                product_id = product_id.id
            try:
                product = Product.objects.get(id=product_id)
                instance.product = product
            except Product.DoesNotExist:
                raise ValidationError({'product_id': 'The Product does not exist.'})

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance