"""
Signals for cache invalidation in finance app.
"""
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

from core.signals import register_cache_invalidation_signals
from core.cache_utils import clear_action_caches
from finance.models import Finance

register_cache_invalidation_signals(Finance, 'finances')

@receiver(post_save, sender=Finance)
@receiver(post_delete, sender=Finance)
def invalidate_finance_action_caches(sender, **kwargs):
    """Invalidate finance action caches when data changes"""
    clear_action_caches('finance_')
