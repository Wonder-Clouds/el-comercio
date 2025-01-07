from rest_framework import routers
from .views import DetailAssignmentViewSet
from django.urls import path, include

router = routers.DefaultRouter()
router.register(r'', DetailAssignmentViewSet)

urlpatterns = [
    path('detail-assignments/', include(router.urls)),
]