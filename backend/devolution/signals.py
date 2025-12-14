"""
Signals for cache invalidation in devolution app.
"""
from core.signals import register_cache_invalidation_signals
from devolution.models import Devolution

register_cache_invalidation_signals(Devolution, 'devolutions')
