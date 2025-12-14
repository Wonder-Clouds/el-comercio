"""
Signals for cache invalidation in product app.
"""
from core.signals import register_cache_invalidation_signals
from product.models import Product

register_cache_invalidation_signals(Product, 'products')
