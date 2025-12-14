"""
Signals for cache invalidation in cash app.
"""
from core.signals import register_cache_invalidation_signals
from cash.models import Cash

register_cache_invalidation_signals(Cash, 'cash')
