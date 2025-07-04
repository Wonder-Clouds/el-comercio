from django.db import models
from core.models import TimeStampedModel

# Create your models here.
class TypeProduct(TimeStampedModel):
    TYPE = (
        ('NEWSPAPER', 'NEWSPAPER'),
        ('PRODUCT', 'PRODUCT'),
    )
        
    """
    Model representing a TypeProduct
    """
    name = models.CharField(max_length=250, null=False, blank=False)
    type = models.CharField(max_length=50, choices=TYPE, default='PRODUCT', null=False, blank=False)

    def __str__(self):
        return self.name
    