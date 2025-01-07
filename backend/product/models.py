from django.db import models
from core.models import TimeStampedModel

# Create your models here.
class Product(TimeStampedModel):
    TYPE = (
        ('NEWSPAPER', 'NEWSPAPER'),
        ('PRODUCT', 'PRODUCT'),
    )

    name = models.CharField(max_length=255, default='', null=False, blank=False)
    type = models.CharField(max_length=9, choices=TYPE, default='PRODUCT', null=False, blank=False)
    returns_date = models.IntegerField(default=0, null=False, blank=False)

    def __str__(self):
        return self.name + ' ' + self.type