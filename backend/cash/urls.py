from rest_framework import routers
from .views import CashViewSet
from django.urls import path, include


router = routers.DefaultRouter()
router.register(r'', CashViewSet)

urlpatterns = [
    path('cash/', include(router.urls))
]
