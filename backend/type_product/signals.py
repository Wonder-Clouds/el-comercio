"""
Signals for cache invalidation in type_product app.
"""
from core.signals import register_cache_invalidation_signals
from type_product.models import TypeProduct

register_cache_invalidation_signals(TypeProduct, 'type_products')
