"""
Signals for cache invalidation in yape app.
"""
from core.signals import register_cache_invalidation_signals
from yape.models import Yape

register_cache_invalidation_signals(Yape, 'yapes')
