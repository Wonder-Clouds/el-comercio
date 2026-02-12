from django.db import models
from core.models import TimeStampedModel
from type_product.models import TypeProduct

# Create your models here.
class Product(TimeStampedModel):
    name = models.CharField(max_length=255, default='', null=False, blank=False)
    returns_date = models.IntegerField(default=0, null=False, blank=False)
    base_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, default=0.00)
    discount_percent = models.DecimalField(max_digits=5, decimal_places=2, default=0.00, null=True, blank=True) # Example 0.15 for 15% discount
    product_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, default=0.00)
    status_product = models.BooleanField(default=False, null=False, blank=False)
    total_quantity = models.IntegerField(default=0, null=True, blank=True)
    reserved_quantity = models.IntegerField(default=0, null=False, blank=False)

    type_product = models.ForeignKey(TypeProduct, on_delete=models.CASCADE, null=True, blank=True)
    assignments = models.ManyToManyField('assignment.Assignment', related_name='products', blank=True)

    def save(self, *args, **kwargs):
        if self.base_price is not None and self.discount_percent is not None:
            discount = self.base_price * self.discount_percent
            self.product_price = self.base_price - discount

        if self.total_quantity is not None and self.reserved_quantity is not None:
            if self.available_stock <= 0:
                self.status_product = False
            else:
                self.status_product = True
        super().save(*args, **kwargs)

    @property
    def available_stock(self):
        """
        Calculate the available stock for assignment.
        available_stock = total_quantity - reserved_quantity
        """
        return self.total_quantity - self.reserved_quantity

    def __str__(self):
        return self.name + ' ' + self.type_product.name