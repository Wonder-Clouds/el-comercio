"""
Generic signals for cache invalidation.
Auto-registers signals for any model that needs cache invalidation.
"""
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from core.cache_utils import invalidate_model_cache, invalidate_model_detail_cache


def register_cache_invalidation_signals(model, model_name):
    """
    Register cache invalidation signals for a model.
    
    Args:
        model: The Django model class
        model_name: The name to use for cache keys (e.g., 'assignments', 'products')
    
    Usage:
        In your app's apps.py ready() method:
        
        from core.signals import register_cache_invalidation_signals
        from myapp.models import MyModel
        
        register_cache_invalidation_signals(MyModel, 'mymodels')
    """
    
    @receiver(post_save, sender=model)
    def invalidate_model_cache_on_save(sender, instance, created, **kwargs):
        """Invalidate model cache when saved."""
        invalidate_model_cache(model_name)
        invalidate_model_detail_cache(model_name, instance.id)
    
    @receiver(post_delete, sender=model)
    def invalidate_model_cache_on_delete(sender, instance, **kwargs):
        """Invalidate model cache when deleted."""
        invalidate_model_cache(model_name)
        invalidate_model_detail_cache(model_name, instance.id)
