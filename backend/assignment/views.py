from rest_framework import viewsets
from .models import  Assignment
from .serializer import  AssignmentSerializer

# Create your views here.
class AssignmentViewSet(viewsets.ModelViewSet):
    queryset = Assignment.objects.all()
    serializer_class = AssignmentSerializer
