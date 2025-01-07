from django.db import models
from core.models import TimeStampedModel
from detail_assignment.models import DetailAssignment

# Create your models here.
class Devolution(TimeStampedModel):
    devolution_date = models.DateField(null=False, blank=False)
    quantity = models.IntegerField(default=0, null=False, blank=False)

    detail_assignment = models.ForeignKey(DetailAssignment, on_delete=models.CASCADE, null=False, blank=False)
    
    def __str__(self):
        return self.detail_assignment.assignment.seller.name + ' ' + f'{ self.devolution_date }' + ' ' + f'{ self.quantity }' + ' ' + f'{self.detail_assignment.quantity}'