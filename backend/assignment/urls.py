from rest_framework import routers
from .views import AssignmentViewSet, ReportViewSet
from django.urls import path, include

# Create routers and register the ViewSets
assignments_router = routers.DefaultRouter()
assignments_router.register(r'', AssignmentViewSet)

reports_router = routers.DefaultRouter()
reports_router.register(r'', ReportViewSet, basename='report')

# Define the URL patterns for the assignment app
urlpatterns = [
    path('assignments/', include(assignments_router.urls)),
    path('reports/', include(reports_router.urls)),
]