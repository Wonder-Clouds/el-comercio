"""
Signals for cache invalidation in assignment app.
Uses the generic signal registration from core.signals.
"""
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.core.cache import cache

from core.signals import register_cache_invalidation_signals
from core.cache_utils import clear_action_caches
from assignment.models import Assignment
from detail_assignment.models import DetailAssignment

# Register cache invalidation for Assignment model
register_cache_invalidation_signals(Assignment, 'assignments')

# Register cache invalidation for DetailAssignment model (related to assignments)
register_cache_invalidation_signals(DetailAssignment, 'detail_assignments')

@receiver(post_save, sender=Assignment)
@receiver(post_delete, sender=Assignment)
@receiver(post_save, sender=DetailAssignment)
@receiver(post_delete, sender=DetailAssignment)
def invalidate_report_caches(sender, **kwargs):
    """Invalidate all report action caches when data changes"""
    clear_action_caches('report_')
    clear_action_caches('assignment_')
