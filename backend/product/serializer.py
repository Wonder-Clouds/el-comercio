from rest_framework import serializers
from .models import Product


class ProductSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'type', 'returns_date', 'monday_price', 'tuesday_price', 'wednesday_price',
                  'thursday_price', 'friday_price', 'saturday_price', 'sunday_price', 'product_price', 'status_product', 'total_quantity']

    def validate(self, data):
        product_type = data.get('type', self.instance.type if self.instance else None)

        if product_type == 'PRODUCT':
            data['monday_price'] = None
            data['tuesday_price'] = None
            data['wednesday_price'] = None
            data['thursday_price'] = None
            data['friday_price'] = None
            data['saturday_price'] = None
            data['sunday_price'] = None
            if data.get('product_price') is None and not self.partial:
                raise serializers.ValidationError("Product price must be set for PRODUCT type.")
        elif product_type == 'NEWSPAPER':
            data['product_price'] = None
            for day in ['monday_price', 'tuesday_price', 'wednesday_price', 'thursday_price', 'friday_price',
                        'saturday_price', 'sunday_price']:
                if data.get(day) is None and not self.partial:
                    raise serializers.ValidationError(
                        f"{day.replace('_', ' ').capitalize()} must be set for NEWSPAPER type.")
        return data

    def update(self, instance, validated_data):
        product_type = validated_data.get('type', instance.type)

        if product_type == 'PRODUCT':
            validated_data['monday_price'] = None
            validated_data['tuesday_price'] = None
            validated_data['wednesday_price'] = None
            validated_data['thursday_price'] = None
            validated_data['friday_price'] = None
            validated_data['saturday_price'] = None
            validated_data['sunday_price'] = None
        elif product_type == 'NEWSPAPER':
            validated_data['product_price'] = None
            for day in ['monday_price', 'tuesday_price', 'wednesday_price', 'thursday_price', 'friday_price',
                        'saturday_price', 'sunday_price']:
                if day not in validated_data:
                    validated_data[day] = getattr(instance, day)
        return super().update(instance, validated_data)