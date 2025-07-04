import django_filters
from .models import Cash


class CashFilter(django_filters.FilterSet):
    """
    FilterSet for the Cash model that allows filtering by:
    - Specific date
    - Date range (from and to)
    - Combination of both
    """
    
    # Filter by specific date
    date_cash = django_filters.DateFilter(
        field_name='date_cash',
        lookup_expr='exact',
        label='Specific date (YYYY-MM-DD)'
    )
    
    # Filters for date range
    date_from = django_filters.DateFilter(
        field_name='date_cash',
        lookup_expr='gte',
        label='Date from (YYYY-MM-DD)'
    )
    
    date_to = django_filters.DateFilter(
        field_name='date_cash',
        lookup_expr='lte',
        label='Date to (YYYY-MM-DD)'
    )
    
    # Filter by year
    year = django_filters.NumberFilter(
        field_name='date_cash__year',
        label='Year'
    )
    
    # Filter by month
    month = django_filters.NumberFilter(
        field_name='date_cash__month',
        label='Month (1-12)'
    )
    
    # Filter by total range
    total_min = django_filters.NumberFilter(
        field_name='total',
        lookup_expr='gte',
        label='Minimum total'
    )
    
    total_max = django_filters.NumberFilter(
        field_name='total',
        lookup_expr='lte',
        label='Maximum total'
    )

    class Meta:
        model = Cash
        fields = {
            'date_cash': ['exact'],
        }
        
    def filter_queryset(self, queryset):
        """
        Custom method to handle filtering logic.
        If date_cash is provided, it takes priority over the date range.
        """
        # Apply base filters
        queryset = super().filter_queryset(queryset)
        
        # If an exact date is specified, ignore the date range
        if self.data.get('date_cash'):
            # The date_cash filter was already applied in super().filter_queryset()
            return queryset
            
        return queryset
    