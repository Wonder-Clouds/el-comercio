"""
Signals for cache invalidation in devolution app.
"""
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

from core.signals import register_cache_invalidation_signals
from core.cache_utils import clear_action_caches
from devolution.models import Devolution

register_cache_invalidation_signals(Devolution, 'devolutions')

@receiver(post_save, sender=Devolution)
@receiver(post_delete, sender=Devolution)
def invalidate_devolution_action_caches(sender, **kwargs):
    """Invalidate devolution action caches when data changes"""
    clear_action_caches('devolution_')
