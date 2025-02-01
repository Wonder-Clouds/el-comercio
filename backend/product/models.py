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
    monday_price = models.DecimalField(max_digits=10, decimal_places=2, null=False, blank=False, default=0.00)
    tuesday_price = models.DecimalField(max_digits=10, decimal_places=2, null=False, blank=False, default=0.00)
    wednesday_price = models.DecimalField(max_digits=10, decimal_places=2, null=False, blank=False, default=0.00)
    thursday_price = models.DecimalField(max_digits=10, decimal_places=2, null=False, blank=False, default=0.00)
    friday_price = models.DecimalField(max_digits=10, decimal_places=2, null=False, blank=False, default=0.00)
    saturday_price = models.DecimalField(max_digits=10, decimal_places=2, null=False, blank=False, default=0.00)
    sunday_price = models.DecimalField(max_digits=10, decimal_places=2, null=False, blank=False, default=0.00)
    product_price = models.DecimalField(max_digits=10, decimal_places=2, null=False, blank=False, default=0.00)
    status_product = models.BooleanField(default=False, null=False, blank=False)

    def __str__(self):
        return self.name + ' ' + self.type + ' ' + f'{ self.status_product }'

