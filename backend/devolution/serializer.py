from rest_framework import serializers
from detail_assignment.serializer import DetailAssignmentSerializer
from .models import Devolution

class DevolutionSerializer(serializers.HyperlinkedModelSerializer):
    detail_assignment = DetailAssignmentSerializer(read_only=True)
    detail_assignment_id = serializers.PrimaryKeyRelatedField(
        queryset=Devolution.objects.all(), write_only=True
    )

    devolution_date = serializers.DateField(read_only=True)

    class Meta:
        model = Devolution
        fields = ['id', 'detail_assignment_id', 'detail_assignment', 'devolution_date', 'quantity']