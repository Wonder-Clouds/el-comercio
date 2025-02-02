from django.db import models
from .querysets import SoftDeleteQuerySet

class SoftDeleteManager(models.Manager):
    """
    Manager class to handle soft-deleted objects.
    """
    def get_queryset(self):
        """
        Returns a queryset that filters out soft-deleted objects.
        """
        return SoftDeleteQuerySet(self.model, using=self._db).alive()