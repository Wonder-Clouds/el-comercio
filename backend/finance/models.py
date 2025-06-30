from django.db import models
from core.models import TimeStampedModel

# Create your models here.
class Finance(TimeStampedModel):
    OPERATION = (
        ('INCOME', 'INCOME'),
        ('EXPENSE', 'EXPENSE'),
    )

    date_finance = models.DateField(null=False, blank=False, auto_now=True)
    description = models.TextField(null=True, blank=True)
    type_operation = models.CharField(choices=OPERATION, null=False, blank=False)
    amount = models.DecimalField(max_digits=10, decimal_places=3, null=False, blank=False)

    def __str__(self):
        return f'{self.type_operation}' + ' ' + f'{self.amount}' + ' ' + f'{self.date_finance}'
        