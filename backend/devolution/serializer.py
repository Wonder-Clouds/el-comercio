from rest_framework import serializers
from detail_assignment.serializer import DetailAssignmentSerializer
from .models import Devolution

class DevolutionSerializer(serializers.HyperlinkedModelSerializer):
    detail_assignment = DetailAssignmentSerializer(read_only=True)

    class Meta:
        model = Devolution
        fields = ['id', 'quantity', 'detail_assignment', 'devolution_date', 'quantity']