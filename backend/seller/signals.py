"""
Signals for cache invalidation in seller app.
"""
from core.signals import register_cache_invalidation_signals
from seller.models import Seller

register_cache_invalidation_signals(Seller, 'sellers')
