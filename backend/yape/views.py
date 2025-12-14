from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django_filters.rest_framework import DjangoFilterBackend

from .models import Yape
from .serializer import YapeSerializer
from .filters import YapeFilter
from core.pagination import CustomPagination
from core.cache_mixin import CacheMixin


# Create your views here.
class YapeViewSet(CacheMixin, viewsets.ModelViewSet):

    # Cache configuration
    cache_key_prefix = 'yapes'
    cache_timeout = 3600

    # JWT authentication
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    queryset = Yape.objects.all().order_by('-date_yape')
    serializer_class = YapeSerializer
    pagination_class = CustomPagination

    # Settings of filters
    filter_backends = [DjangoFilterBackend]
    filterset_class = YapeFilter
