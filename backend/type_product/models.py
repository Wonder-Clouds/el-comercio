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
    monday_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    tuesday_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    wednesday_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    thursday_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    friday_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    saturday_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    sunday_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)


    def __str__(self):
        return self.name
    