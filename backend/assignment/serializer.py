from rest_framework import serializers
from seller.serializer import SellerSerializer
from assignment.models import Assignment

class AssignmentSerializer(serializers.HyperlinkedModelSerializer):
    seller = SellerSerializer(read_only=True)

    class Meta:
        model = Assignment
        fields = ['id', 'seller', 'date_assignment', 'status']