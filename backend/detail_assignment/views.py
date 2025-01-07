from rest_framework import viewsets
from detail_assignment.models import DetailAssignment
from detail_assignment.serializer import DetailAssignmentSerializer


# Create your views here.
class DetailAssignmentViewSet(viewsets.ModelViewSet):
    queryset = DetailAssignment.objects.all()
    serializer_class = DetailAssignmentSerializer