from django.db import models
from django.utils.timezone import now
from core.managers import SoftDeleteManager

class TimeStampedModel(models.Model):
    """
    An abstract base class model that provides self-updating
    `create_at`, `update_at`, and `delete_at` fields.
    """
    create_at = models.DateTimeField(auto_now_add=True)
    update_at = models.DateTimeField(auto_now=True)
    delete_at = models.DateTimeField(null=True, blank=True, editable=False)

    objects = SoftDeleteManager()  # Manager that excludes logically deleted objects
    all_objects = models.Manager()  # Manager to access all objects, including logically deleted ones

    class Meta:
        abstract = True

    def soft_delete(self):
        """
        Marks the object as deleted by setting the `delete_at` field
        to the current time and applies soft delete in cascade.
        """
        self.delete_at = now()
        self.save()

        # Apply soft delete in cascade to related objects
        for related_object in self._meta.related_objects:
            related_name = related_object.get_accessor_name()
            related_manager = getattr(self, related_name)
            if isinstance(related_manager, models.Manager):
                related_manager.all().update(delete_at=now())

    def restore(self):
        """
        Restores the object by setting the `delete_at` field to None.
        """
        self.delete_at = None
        self.save()

    @property
    def is_deleted(self):
        """
        Returns True if the object is marked as deleted.
        """
        return self.delete_at is not None

    def delete(self, *args, **kwargs):
        """
        Overrides the delete method to perform a soft delete.
        """
        self.soft_delete()