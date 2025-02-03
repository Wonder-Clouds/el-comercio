from rest_framework import routers
from .views import DetailAssignmentViewSet
from django.urls import path, include

# Create a default router and register the DetailAssignmentViewSet
router = routers.DefaultRouter()
router.register(r'', DetailAssignmentViewSet)

# Define the URL patterns for the detail assignments
urlpatterns = [
    path('detail-assignments/', include(router.urls)),
]