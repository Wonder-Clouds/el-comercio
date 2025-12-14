"""
Signals for cache invalidation in finance app.
"""
from core.signals import register_cache_invalidation_signals
from finance.models import Finance

register_cache_invalidation_signals(Finance, 'finances')
