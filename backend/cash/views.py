from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django_filters.rest_framework import DjangoFilterBackend

from .models import Cash
from .serializer import CashSerializer
from .filters import CashFilter
from core.pagination import CustomPagination

# Create your views here.
class CashViewSet(viewsets.ModelViewSet):

    # JWT authentication
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    queryset = Cash.objects.all().order_by('-date_cash')
    serializer_class = CashSerializer
    pagination_class = CustomPagination
    
    # Settings of filters
    filter_backends = [DjangoFilterBackend]
    filterset_class = CashFilter
