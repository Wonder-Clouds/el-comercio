from rest_framework import viewsets
from devolution.models import Devolution
from devolution.serializer import DevolutionSerializer


# Create your views here.
class DevolutionViewSet(viewsets.ModelViewSet):
    queryset = Devolution.objects.all()
    serializer_class = DevolutionSerializer
