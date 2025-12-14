"""
Signals for cache invalidation in assignment app.
Uses the generic signal registration from core.signals.
"""
from core.signals import register_cache_invalidation_signals
from assignment.models import Assignment
from detail_assignment.models import DetailAssignment

# Register cache invalidation for Assignment model
register_cache_invalidation_signals(Assignment, 'assignments')

# Register cache invalidation for DetailAssignment model (related to assignments)
register_cache_invalidation_signals(DetailAssignment, 'detail_assignments')

