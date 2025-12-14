"""
Cache mixin for ViewSets to provide automatic caching of list and retrieve operations.
Include this mixin in any ModelViewSet to automatically cache GET requests and invalidate on mutations.
"""
from rest_framework.response import Response
import json
from django.core.cache import cache
from core.cache_utils import invalidate_model_cache, invalidate_model_detail_cache


class CacheMixin:
    """
    Mixin to add caching functionality to ViewSets.
    
    Usage:
        class MyViewSet(CacheMixin, viewsets.ModelViewSet):
            cache_key_prefix = 'my_model'  # Required
            cache_timeout = 3600  # Optional, default 1 hour
    """
    
    cache_key_prefix = None  # Must be set by subclass
    cache_timeout = 3600  # 1 hour default
    
    def get_cache_key_prefix(self):
        """Get the cache key prefix. Override if you need custom logic."""
        if self.cache_key_prefix is None:
            # Auto-generate from model name if not provided
            return self.queryset.model.__name__.lower() + 's'
        return self.cache_key_prefix
    
    def list(self, request, *args, **kwargs):
        """Override list to implement caching."""
        prefix = self.get_cache_key_prefix()
        page = request.query_params.get('page', 1)
        cache_key = f'{prefix}_list_cache:page:{page}'
        
        # Try to get from cache
        cached_json = cache.get(cache_key)
        if cached_json is not None:
            cached_data = json.loads(cached_json)
            return Response(cached_data)
        
        # If not in cache, get from database
        response = super().list(request, *args, **kwargs)
        
        # Serialize response data to JSON and cache it
        try:
            json_data = json.dumps(response.data)
            cache.set(cache_key, json_data, self.cache_timeout)
        except Exception:
            pass  # If caching fails, continue without cache
        
        return response
    
    def retrieve(self, request, *args, **kwargs):
        """Override retrieve to implement caching."""
        instance = self.get_object()
        prefix = self.get_cache_key_prefix()
        cache_key = f'{prefix}_{instance.id}_cache'
        
        # Try to get from cache
        cached_json = cache.get(cache_key)
        if cached_json is not None:
            cached_data = json.loads(cached_json)
            return Response(cached_data)
        
        # If not in cache, get from database
        serializer = self.get_serializer(instance)
        
        # Serialize and cache the response data
        try:
            json_data = json.dumps(serializer.data)
            cache.set(cache_key, json_data, self.cache_timeout)
        except Exception:
            pass  # If caching fails, continue without cache
        
        return Response(serializer.data)
    
    def create(self, request, *args, **kwargs):
        """Override create to invalidate cache after creation."""
        response = super().create(request, *args, **kwargs)
        prefix = self.get_cache_key_prefix()
        invalidate_model_cache(prefix)
        return response
    
    def update(self, request, *args, **kwargs):
        """Override update to invalidate cache after update."""
        instance = self.get_object()
        response = super().update(request, *args, **kwargs)
        prefix = self.get_cache_key_prefix()
        invalidate_model_cache(prefix)
        invalidate_model_detail_cache(prefix, instance.id)
        return response
    
    def partial_update(self, request, *args, **kwargs):
        """Override partial_update to invalidate cache after update."""
        instance = self.get_object()
        response = super().partial_update(request, *args, **kwargs)
        prefix = self.get_cache_key_prefix()
        invalidate_model_cache(prefix)
        invalidate_model_detail_cache(prefix, instance.id)
        return response
    
    def destroy(self, request, *args, **kwargs):
        """Override destroy to invalidate cache after deletion."""
        instance = self.get_object()
        response = super().destroy(request, *args, **kwargs)
        prefix = self.get_cache_key_prefix()
        invalidate_model_cache(prefix)
        invalidate_model_detail_cache(prefix, instance.id)
        return response
