from django.db import models
from django.utils.timezone import now

class TimeStampedModel(models.Model):
    create_at = models.DateTimeField(auto_now_add=True)
    update_at = models.DateTimeField(auto_now=True)
    delete_at = models.DateTimeField(null=True, blank=True, editable=False)

    class Meta:
        abstract = True
    
    def soft_delete(self):
        """Marks the object as deleted"""
        self.delete_at = now()
        self.save()
    
    def restore(self):
        """Restores the object by setting the delete_at field to None"""
        self.delete_at = None
        self.save()
    
    @property
    def is_deleted(self):
        """Returns True if the object is deleted"""
        return self.delete_at is not None
    
    def delete(self, *args, **kwargs):
        """Overrides the delete method to soft delete the object"""
        self.soft_delete()