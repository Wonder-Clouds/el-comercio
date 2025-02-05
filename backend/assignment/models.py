from django.db import models
from core.models import TimeStampedModel
from seller.models import Seller

# Create your models here.
class Assignment(TimeStampedModel):
    """
    Model representing an assignment.
    """

    ASSIGMENT_STATUS = (
        ('PENDING', 'PENDING'),
        ('FINISHED', 'FINISHED'),
    )
    """
    Tuple representing the possible statuses of an assignment.
    """

    date_assignment = models.DateField(null=False, blank=False, auto_now=False)
    """
    DateField representing the date of the assignment.
    """

    status = models.CharField(max_length=11, choices=ASSIGMENT_STATUS, default='PENDING', null=False, blank=False)
    """
    CharField representing the status of the assignment.
    """

    seller = models.ForeignKey(Seller, on_delete=models.CASCADE, null=False, blank=False)
    """
    ForeignKey linking to the Seller model.
    """

    def __str__(self):
        """
        Returns a string representation of the assignment.
        """
        return self.seller.name + ' ' + f'{ self.date_assignment }' + ' ' + self.status