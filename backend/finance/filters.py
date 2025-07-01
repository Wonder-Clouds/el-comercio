import django_filters
from .models import Finance


class FinanceFilter(django_filters.FilterSet):
    """
    Filter for Finance model.
    Allow filtering by date, type of operation, description, and amount.
    """

    # Filter by description (case-sensitive partial match)
    description = django_filters.CharFilter(lookup_expr='icontains')

    # Filter by type of operation
    type_operation = django_filters.ChoiceFilter(choices=Finance.OPERATION)

    # Filter by date range 
    date_finance = django_filters.DateFilter()
    date_finance_from = django_filters.DateFilter(field_name='date_finance', lookup_expr='gte')
    date_finance_to = django_filters.DateFilter(field_name='date_finance', lookup_expr='lte')

    # Filter by amount range
    amount_min = django_filters.NumberFilter(field_name='amount', lookup_expr='gte')
    amount_max = django_filters.NumberFilter(field_name='amount', lookup_expr='lte')

    class Meta:
        model = Finance
        fields = [
            'description',
            'type_operation',
            'date_finance',
            'date_finance_from',
            'date_finance_to',
            'amount_min',
            'amount_max'
        ]
