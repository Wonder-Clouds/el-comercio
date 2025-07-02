from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions
import os
from dotenv import load_dotenv
from django.urls import path

# Create a schema view for the API documentation using drf_yasg
schema_view = get_schema_view(
    openapi.Info(
        title="API v1 - EL COMERCIO",
        default_version='v1',
        description='This is the API of el comercio.',
    ),
    public=True,
    permission_classes=[permissions.AllowAny]
)

DEBUG = os.getenv('DEBUG', 'False').lower() == 'true'
# Define URL patterns for the API documentation

urlpatterns = []

if DEBUG:
    urlpatterns = [
        path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
        path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    ]
