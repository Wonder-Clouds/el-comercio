import uuid
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

    objects = SoftDeleteManager()
    all_objects = models.Manager()

    class Meta:
        abstract = True

    def soft_delete(self):
        """
        Marks the object as deleted by setting the `delete_at` field
        to the current time and applies soft delete in cascade.
        """
        unique_suffix = str(uuid.uuid4().hex)[:4]
        for field in self._meta.fields:
            if field.unique and field.name != 'id':
                original_value = getattr(self, field.name)
                max_length = field.max_length
                truncated_value = original_value[:max_length - len(unique_suffix) - 1]
                setattr(self, f'original_{field.name}', original_value)
                setattr(self, field.name, f'{truncated_value}_{unique_suffix}')

        self.delete_at = now()
        self.save()

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

        for field in self._meta.fields:
            if field.unique and field.name != 'id':
                original_value = getattr(self, f'original_{field.name}', None)
                if original_value:
                    setattr(self, field.name, original_value)

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