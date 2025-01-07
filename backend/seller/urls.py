from rest_framework import routers
from .views import SellerViewSet
from django.urls import path, include

router = routers.DefaultRouter()
router.register(r'', SellerViewSet)

urlpatterns = [
    path('sellers/', include(router.urls)),
]
