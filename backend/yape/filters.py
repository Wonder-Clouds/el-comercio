import django_filters
from .models import Yape


class YapeFilter(django_filters.FilterSet):
    """
    Filter for Yape model.
    Allows filtering by date, operation code, and name.
    """
    
    # Filter by name (case-insensitive partial match)
    name = django_filters.CharFilter(lookup_expr='icontains')
    
    # Filter by operation code (exact match)
    operation_code = django_filters.CharFilter(lookup_expr='exact')
    
    # Filter by date range
    date_yape = django_filters.DateFilter()
    date_yape_from = django_filters.DateFilter(field_name='date_yape', lookup_expr='gte')
    date_yape_to = django_filters.DateFilter(field_name='date_yape', lookup_expr='lte')
    
    class Meta:
        model = Yape
        fields = ['name', 'operation_code', 'date_yape', 'date_yape_from', 'date_yape_to']