from rest_framework import routers
from .views import AssignmentViewSet
from django.urls import path, include

# Create a default router and register the AssignmentViewSet
router = routers.DefaultRouter()
router.register(r'', AssignmentViewSet)

# Define the URL patterns for the assignment app
urlpatterns = [
    path('assignments/', include(router.urls)),
]