from django.db import models
from core.models import TimeStampedModel
from product.models import Product

# Create your models here.
class ProductPrice(TimeStampedModel):
    DAY_WEEK = (
        ('MONDAY', 'MONDAY'),
        ('TUESDAY', 'TUESDAY'),
        ('WEDNESDAY', 'WEDNESDAY'),
        ('THURSDAY', 'THURSDAY'),
        ('FRIDAY', 'FRIDAY'),
        ('SATURDAY', 'SATURDAY'),
        ('SUNDAY', 'SUNDAY'),
    )

    price = models.DecimalField(max_digits=10, decimal_places=2, null=False, blank=False)
    day_week = models.CharField(max_length=9, choices=DAY_WEEK, default='MONDAY', null=False, blank=False)
    start_date = models.DateField(null=False, blank=False)
    end_date = models.DateField(null=True, blank=True)

    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=False, blank=False)

    def __str__(self):
        return self.product.name + ' ' + f'{ self.price }' + ' ' + self.day_week