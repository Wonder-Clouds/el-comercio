from django.db import models
from assignment.models import Assignment
from core.models import TimeStampedModel
from product.models import Product

# Create your models here.
class DetailAssignment(TimeStampedModel):
    quantity = models.IntegerField(default=0, null=False, blank=False)
    returned_amount = models.IntegerField(default=0, null=False, blank=False)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2, null=False, blank=False, editable=False, default=0.00)

    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE, null=False, blank=False)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=False, blank=False)

    def __str__(self):
        return self.assignment.seller.name + ' ' + self.product.name + ' ' + f'{ self.quantity }' + ' ' + f'{ self.unit_price }'
    