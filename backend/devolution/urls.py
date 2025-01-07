from rest_framework import routers
from .views import DevolutionViewSet
from django.urls import path, include

router = routers.DefaultRouter()
router.register(r'', DevolutionViewSet)

urlpatterns = [
    path('devolutions/', include(router.urls))
]