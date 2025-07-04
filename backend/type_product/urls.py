from rest_framework import routers
from .views import TypeProductViewSet
from django.urls import path, include


router = routers.DefaultRouter()
router.register(r'', TypeProductViewSet)

urlpatterns = [
    path('type-products/', include(router.urls))
]