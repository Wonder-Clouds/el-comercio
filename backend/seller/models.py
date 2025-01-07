from django.db import models
from core.models import TimeStampedModel

# Create your models here.
class Seller(TimeStampedModel):
    name = models.CharField(max_length=255, default='', null=False, blank=False)
    last_name = models.CharField(max_length=255, default='', null=False, blank=False)
    dni = models.CharField(max_length=8, unique=True, null=False, blank=False)
    phone = models.CharField(max_length=9, default='', null=False, blank=False)
    status = models.BooleanField(default=False, null=False, blank=False)

    def __str__(self):
        return self.name + ' ' + self.dni