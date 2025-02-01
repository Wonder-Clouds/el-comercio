from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from detail_assignment.models import DetailAssignment
from detail_assignment.serializer import DetailAssignmentSerializer
from .models import Devolution

class DevolutionSerializer(serializers.HyperlinkedModelSerializer):
    detail_assignment = DetailAssignmentSerializer(read_only=True)
    detail_assignment_id = serializers.PrimaryKeyRelatedField(
        queryset=DetailAssignment.objects.all(), write_only=True
    )

    class Meta:
        model = Devolution
        fields = ['id', 'detail_assignment_id', 'detail_assignment', 'devolution_date', 'quantity']

    def create(self, validated_data):
        detail_assignment = validated_data.pop('detail_assignment_id')
        devolution = Devolution.objects.create(detail_assignment=detail_assignment, **validated_data)
        detail_assignment.returned_amount += devolution.quantity
        detail_assignment.save()
        return devolution

    def update(self, instance, validated_data):
        detail_assignment_id = validated_data.pop('detail_assignment_id', None)
        if detail_assignment_id:
            if isinstance(detail_assignment_id, DetailAssignment):
                detail_assignment_id = detail_assignment_id.id
            try:
                detail_assignment = DetailAssignment.objects.get(id=detail_assignment_id)
                instance.detail_assignment = detail_assignment
            except DetailAssignment.DoesNotExist:
                raise ValidationError({'detail_assignment_id': 'The Detail Assignment does not exist.'})

        # Update returned amount
        if 'quantity' in validated_data:
            old_quantity = instance.quantity
            new_quantity = validated_data['quantity']
            total_returned = instance.detail_assignment.returned_amount - old_quantity + new_quantity

            if total_returned > instance.detail_assignment.quantity:
                raise ValidationError({'quantity': 'The quantity returned is greater than the quantity assigned.'})
            if total_returned < 0:
                raise ValidationError({'quantity': 'The quantity returned cannot be negative.'})

            instance.detail_assignment.returned_amount = total_returned
            instance.detail_assignment.save()

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance