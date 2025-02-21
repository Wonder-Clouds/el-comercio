from django.db import models
from assignment.models import Assignment
from core.models import TimeStampedModel
from product.models import Product
import datetime

# Create your models here.
class DetailAssignment(TimeStampedModel):
    """
    Model representing the details of an assignment, including the quantity,
    returned amount, unit price, and references to the assignment and product.
    """
    ASSIGMENT_STATUS = (
        ('PENDING', 'PENDING'),
        ('FINISHED', 'FINISHED'),
    )

    quantity = models.IntegerField(default=0, null=False, blank=False)
    returned_amount = models.IntegerField(default=0, null=False, blank=False)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2, null=False, blank=False, editable=False, default=0.00)
    status = models.CharField(max_length=11, choices=ASSIGMENT_STATUS, default='PENDING', null=False, blank=False)
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE, null=False, blank=False)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=False, blank=False)

    def __str__(self):
        """
        Returns a string representation of the DetailAssignment instance,
        including the seller's name, product name, quantity, and unit price.
        """
        return self.assignment.seller.name + ' ' + self.product.name + ' ' + f'{ self.quantity }' + ' ' + f'{ self.unit_price }'

    def save(self, *args, **kwargs):
        """
        Overrides the save method to set the unit price based on the product type
        and the current day if the unit price is not already set.
        """
        if not self.unit_price:
            current_day = datetime.datetime.now().strftime('%A').lower()
            if self.product.type == 'PRODUCT':
                self.unit_price = self.product.product_price
            elif self.product.type == 'NEWSPAPER':
                self.unit_price = getattr(self.product, f'{current_day}_price')
        super().save(*args, **kwargs)