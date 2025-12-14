"""
Cache utilities for cache invalidation across the application.
Provides centralized cache invalidation logic for all viewsets.
"""
from django.core.cache import cache


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


# Legacy functions for backwards compatibility
def invalidate_assignments_cache():
    """Invalidate all assignment caches."""
    invalidate_model_cache('assignments')


def invalidate_assignment_detail_cache(assignment_id):
    """Invalidate cache for a specific assignment."""
    invalidate_model_detail_cache('assignment', assignment_id)
