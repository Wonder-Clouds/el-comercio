"""
Signals for cache invalidation in detail_assignment app.
"""
from core.signals import register_cache_invalidation_signals
from detail_assignment.models import DetailAssignment

register_cache_invalidation_signals(DetailAssignment, 'detail_assignments')
