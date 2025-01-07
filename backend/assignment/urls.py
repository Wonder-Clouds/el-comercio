from rest_framework import routers
from .views import AssignmentViewSet
from django.urls import path, include

router = routers.DefaultRouter()
router.register(r'', AssignmentViewSet)

urlpatterns = [
    path('assignments/', include(router.urls)),
]