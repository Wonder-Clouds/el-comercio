from django.db import models
from core.models import TimeStampedModel

# Create your models here.
class Cash(TimeStampedModel):
    """
    Model representing an Cash
    """
    date_cash = models.DateField(null=False, blank=False, auto_now=False)
    two_hundred = models.IntegerField(null=True, blank=True)
    one_hundred = models.IntegerField(null=True, blank=True)
    fifty = models.IntegerField(null=True, blank=True)
    twenty = models.IntegerField(null=True, blank=True)
    ten = models.IntegerField(null=True, blank=True)
    five = models.IntegerField(null=True, blank=True)
    two = models.IntegerField(null=True, blank=True)
    one = models.IntegerField(null=True, blank=True)
    fifty_cents = models.IntegerField(null=True, blank=True)
    twenty_cents = models.IntegerField(null=True, blank=True)
    ten_cents = models.IntegerField(null=True, blank=True)
    total = models.DecimalField(max_digits=10, decimal_places=3, null=True, blank=True)

    def __str__(self):
        return f'{self.date_cash}' + ' ' + f'{self.total}'
    