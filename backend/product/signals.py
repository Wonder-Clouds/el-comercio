"""
Signals for cache invalidation in product app.
"""
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

from core.signals import register_cache_invalidation_signals
from core.cache_utils import clear_action_caches
from product.models import Product

register_cache_invalidation_signals(Product, 'products')

@receiver(post_save, sender=Product)
@receiver(post_delete, sender=Product)
def invalidate_product_action_caches(sender, **kwargs):
    """Invalidate product action caches when data changes"""
    clear_action_caches('product_')
