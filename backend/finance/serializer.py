from rest_framework import serializers
from .models import Finance


class FinanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Finance
        fields = ['id', 'date_finance', 'description', 'type_operation', 'amount']
    