from rest_framework import routers
from .views import YapeViewSet
from django.urls import path, include


router = routers.DefaultRouter()
router.register(r'', YapeViewSet)

urlpatterns = [
    path('yape/', include(router.urls))
]