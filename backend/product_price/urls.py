from rest_framework import routers
from .views import ProductPriceViewSet
from django.urls import path, include

router = routers.DefaultRouter()
router.register(r'', ProductPriceViewSet)

urlpatterns = [
    path('product-prices/', include(router.urls)),
]