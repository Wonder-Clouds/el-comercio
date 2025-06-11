from django.db import models
from core.models import TimeStampedModel
from seller.models import Seller

# Create your models here.
class Assignment(TimeStampedModel):
    """
    Model representing an assignment.
    """
    date_assignment = models.DateField(null=False, blank=False, auto_now=False)
    seller = models.ForeignKey(Seller, on_delete=models.CASCADE, null=False, blank=False)

    def __str__(self):
        """
        Returns a string representation of the assignment.
        """
        return self.seller.name + ' ' + f'{ self.date_assignment }'
    