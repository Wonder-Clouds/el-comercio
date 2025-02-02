from django_filters import rest_framework as filters
from .models import Assignment

class AssignmentFilter(filters.FilterSet):
    start_date = filters.DateFilter(field_name="date_assignment", lookup_expr='gte')
    end_date = filters.DateFilter(field_name="date_assignment", lookup_expr='lte')
    seller_name = filters.CharFilter(field_name="seller__name", lookup_expr='icontains')
    seller_last_name = filters.CharFilter(field_name="seller__last_name", lookup_expr='icontains')
    seller_number_seller = filters.CharFilter(field_name="seller__number_seller", lookup_expr='icontains')
    seller_dni = filters.CharFilter(field_name="seller__dni", lookup_expr='icontains')

    class Meta:
        model = Assignment
        fields = ['start_date', 'end_date', 'seller_name', 'seller_last_name', 'seller_number_seller', 'seller_dni']