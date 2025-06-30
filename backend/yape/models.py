from django.db import models
from core.models import TimeStampedModel


# Create your models here.
class Yape(TimeStampedModel):
    """
    Model representing an Yape Payment
    """

    name = models.CharField(max_length=250, null=False, blank=False)
    amount = models.DecimalField(decimal_places=2, max_digits=255, null=False, blank=False)
    date_yape = models.DateField(null=True, blank=True)
    operation_code = models.CharField(max_length=3, null=True, blank=True, unique=True)


    def __str__(self):
        return self.name+ ' ' + f'{self.date_yape}' + ' ' + f'{self.amount}'
    