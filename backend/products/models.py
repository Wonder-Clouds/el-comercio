from django.db import models
from core.models import TimeStampedModel

# Create your models here.
class Product(TimeStampedModel):
    product_name = models.CharField(max_length=255, null=False, blank=False)
    description = models.TextField(null=True, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField()
