from rest_framework import  routers
from .views import ProductViewSet
from django.urls import path, include

router = routers.DefaultRouter()
router.register(r'', ProductViewSet)

urlpatterns = [
    path('products/', include(router.urls)),
]