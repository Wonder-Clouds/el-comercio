from django.db import models
from core.models import TimeStampedModel
from seller.models import Seller

# Create your models here.
class Assignment(TimeStampedModel):

    ASSIGMENT_STATUS = (
        ('PENDING', 'PENDING'),
        ('IN_PROGRESS', 'IN_PROGRESS'),
        ('FINISHED', 'FINISHED'),
    )

    date_assignment = models.DateField(null=False, blank=False, auto_now=False)
    status = models.CharField(max_length=11, choices=ASSIGMENT_STATUS, default='PENDING', null=False, blank=False)

    seller = models.ForeignKey(Seller, on_delete=models.CASCADE, null=False, blank=False)

    def __str__(self):
        return self.seller.name + ' ' + f'{ self.date_assignment }' + ' ' + self.status
