from django.db import models
from assignment.models import Assignment
from core.models import TimeStampedModel
from product.models import Product
from product_price.models import ProductPrice


# Create your models here.
class DetailAssignment(TimeStampedModel):
    quantity = models.IntegerField(default=0, null=False, blank=False)
    returned_amount = models.IntegerField(default=0, null=False, blank=False)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2, null=False, blank=False, editable=False)

    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE, null=False, blank=False)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=False, blank=False)

    def __str__(self):
        return self.assignment.seller.name + ' ' + self.product.name + ' ' + f'{ self.quantity }' + ' ' + f'{ self.unit_price }'


    def save(self, *args, **kwargs):
        if not self.unit_price:
            try:
                product_price = ProductPrice.objects.get(product=self.product)
                self.unit_price = product_price.price
            except ProductPrice.DoesNotExist:
                raise ValueError('ProductPrice matching query does not exist.')
        super().save(*args, **kwargs)