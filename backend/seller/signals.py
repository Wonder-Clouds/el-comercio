"""
Signals for cache invalidation in seller app.
"""
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

from core.signals import register_cache_invalidation_signals
from core.cache_utils import clear_action_caches
from seller.models import Seller
from detail_assignment.models import DetailAssignment

register_cache_invalidation_signals(Seller, 'sellers')

@receiver(post_save, sender=DetailAssignment)
@receiver(post_delete, sender=DetailAssignment)
def invalidate_unpaid_assignment_cache_on_detail_assignment(sender, **kwargs):
    """Invalidate unpaid assignment cache when DetailAssignment changes"""
    clear_action_caches('seller_unpaid_')

@receiver(post_save, sender=Seller)
def invalidate_unpaid_assignment_cache_on_seller_update(sender, **kwargs):
    """Invalidate unpaid assignment cache when Seller info changes"""
    clear_action_caches('seller_unpaid_')
