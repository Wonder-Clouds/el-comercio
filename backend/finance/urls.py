from rest_framework import routers
from django.urls import path, include

from .views import FinanceViewSet

router = routers.DefaultRouter()
router.register(r'', FinanceViewSet)

urlpatterns = [
    path('finance/', include(router.urls))
]