"""
Signals for cache invalidation in detail_assignment app.
"""
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

from core.signals import register_cache_invalidation_signals
from core.cache_utils import clear_action_caches
from detail_assignment.models import DetailAssignment

register_cache_invalidation_signals(DetailAssignment, 'detail_assignments')

@receiver(post_save, sender=DetailAssignment)
@receiver(post_delete, sender=DetailAssignment)
def invalidate_detail_assignment_action_caches(sender, **kwargs):
    """Invalidate detail_assignment action caches when data changes"""
    clear_action_caches('detail_assignment_')
