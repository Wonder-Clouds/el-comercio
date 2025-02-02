from django.db import models
from django.utils import timezone

class SoftDeleteQuerySet(models.QuerySet):
    """
    A custom QuerySet that provides soft delete functionality.
    """

    def delete(self):
        """
        Soft delete the records by setting the delete_at field to the current time.
        """
        return super().update(delete_at=timezone.now())

    def hard_delete(self):
        """
        Permanently delete the records from the database.
        """
        return super().delete()

    def alive(self):
        """
        Filter the records that are not soft deleted (delete_at is null).
        """
        return self.filter(delete_at__isnull=True)

    def dead(self):
        """
        Filter the records that are soft deleted (delete_at is not null).
        """
        return self.filter(delete_at__isnull=False)