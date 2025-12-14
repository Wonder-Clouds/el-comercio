"""
Cache utilities for cache invalidation across the application.
Provides centralized cache invalidation logic for all viewsets.
"""
from django.core.cache import cache
from rest_framework.response import Response
from rest_framework import status
from functools import wraps
from django.core.serializers.json import DjangoJSONEncoder
import json
import hashlib


def invalidate_model_cache(model_name):
    """
    Invalidate all cache for a specific model.
    
    Args:
        model_name (str): The name of the model (e.g., 'assignments', 'cash', 'products')
    """
    # Delete cache for common page numbers
    for page in range(1, 11):
        cache_key = f'{model_name}_list_cache:page:{page}'
        cache.delete(cache_key)
    
    # Also delete the default cache key
    cache.delete(f'{model_name}_list_cache')


def invalidate_model_detail_cache(model_name, obj_id):
    """
    Invalidate cache for a specific model instance detail.
    
    Args:
        model_name (str): The name of the model (e.g., 'assignment', 'cash', 'product')
        obj_id (int): The ID of the object
    """
    cache_key = f'{model_name}_{obj_id}_cache'
    cache.delete(cache_key)


def invalidate_all_model_caches(model_name):
    """
    Invalidate all caches for a model (both list and detail).
    
    Args:
        model_name (str): The name of the model
    """
    invalidate_model_cache(model_name)


def cached_action(timeout=3600, cache_prefix=None):
    """
    Decorator to cache action responses.
    
    Usage:
        @cached_action(timeout=3600, cache_prefix='my_action')
        @action(detail=False, methods=['get'])
        def my_action(self, request):
            return Response(data)
    
    Args:
        timeout (int): Cache timeout in seconds (default: 1 hour)
        cache_prefix (str): Custom cache key prefix (uses action name if not provided)
    """
    def decorator(func):
        @wraps(func)
        def wrapper(self, request, *args, **kwargs):
            # Only cache GET requests
            if request.method != 'GET':
                return func(self, request, *args, **kwargs)
            
            # Generate cache key from request parameters and path
            prefix = cache_prefix or func.__name__
            params_str = json.dumps(request.query_params.dict(), sort_keys=True, default=str)
            params_hash = hashlib.md5(params_str.encode()).hexdigest()
            cache_key = f'{prefix}_{params_hash}'
            
            # Try to get from cache
            cached_json = cache.get(cache_key)
            if cached_json:
                return Response(json.loads(cached_json), status=status.HTTP_200_OK)
            
            # Execute the action
            response = func(self, request, *args, **kwargs)
            
            # Cache the response data (only if successful)
            if response.status_code < 400:
                try:
                    # Cache response.data directly as JSON (no rendering needed)
                    cache.set(cache_key, json.dumps(response.data, cls=DjangoJSONEncoder), timeout)
                except Exception:
                    # If caching fails, continue without cache
                    pass
            return response
        
        return wrapper
    return decorator


def clear_action_caches(action_prefix):
    """
    Clear all caches for actions with a specific prefix.
    
    Args:
        action_prefix (str): The prefix to match (e.g., 'report_', 'product_')
    """
    keys_to_delete = []
    for key in cache.keys(f'{action_prefix}*'):
        if key.startswith(action_prefix):
            keys_to_delete.append(key)
    if keys_to_delete:
        cache.delete_many(keys_to_delete)


# Legacy functions for backwards compatibility
def invalidate_assignments_cache():
    """Invalidate all assignment caches."""
    invalidate_model_cache('assignments')

def invalidate_assignment_detail_cache(assignment_id):
    """Invalidate cache for a specific assignment."""
    invalidate_model_detail_cache('assignment', assignment_id)
