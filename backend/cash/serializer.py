from rest_framework import serializers
from .models import Cash

class CashSerializer(serializers.ModelSerializer):
    """
    Serializer for the Cash model.
    """

    total = serializers.FloatField(read_only=True)

    class Meta:
        model = Cash
        fields = ['id', 'date_cash', 'type_product','two_hundred', 'one_hundred', 'fifty', 'twenty', 'ten', 'five', 'two', 'one', 'fifty_cents', 'twenty_cents', 'ten_cents', 'total']

    def calculate_total(self, validated_data):
        return (
            validated_data.get('two_hundred', 0) * 200 +
            validated_data.get('one_hundred', 0) * 100 +
            validated_data.get('fifty', 0) * 50 +
            validated_data.get('twenty', 0) * 20 +
            validated_data.get('ten', 0) * 10 +
            validated_data.get('five', 0) * 5 +
            validated_data.get('two', 0) * 2 +
            validated_data.get('one', 0) * 1 +
            validated_data.get('fifty_cents', 0) * 0.5 +
            validated_data.get('twenty_cents', 0) * 0.2 +
            validated_data.get('ten_cents', 0) * 0.1
        )

    def create(self, validated_data):
        validated_data['total'] = self.calculate_total(validated_data)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.total = self.calculate_total({
            'two_hundred': getattr(instance, 'two_hundred', 0),
            'one_hundred': getattr(instance, 'one_hundred', 0),
            'fifty': getattr(instance, 'fifty', 0),
            'twenty': getattr(instance, 'twenty', 0),
            'ten': getattr(instance, 'ten', 0),
            'five': getattr(instance, 'five', 0),
            'two': getattr(instance, 'two', 0),
            'one': getattr(instance, 'one', 0),
            'fifty_cents': getattr(instance, 'fifty_cents', 0),
            'twenty_cents': getattr(instance, 'twenty_cents', 0),
            'ten_cents': getattr(instance, 'ten_cents', 0),
        })
        instance.save()
        return instance
