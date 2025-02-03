from django_filters import rest_framework as filters
from .models import Assignment

class AssignmentFilter(filters.FilterSet):
    """
    FilterSet for filtering Assignment objects based on various criteria.
    """

    start_date = filters.DateFilter(field_name="date_assignment", lookup_expr='gte')
    """Filter for assignments starting from a specific date."""

    end_date = filters.DateFilter(field_name="date_assignment", lookup_expr='lte')
    """Filter for assignments ending on or before a specific date."""

    seller_name = filters.CharFilter(field_name="seller__name", lookup_expr='icontains')
    """Filter for assignments by seller's first name (case insensitive)."""

    seller_last_name = filters.CharFilter(field_name="seller__last_name", lookup_expr='icontains')
    """Filter for assignments by seller's last name (case insensitive)."""

    seller_number_seller = filters.CharFilter(field_name="seller__number_seller", lookup_expr='icontains')
    """Filter for assignments by seller's number (case insensitive)."""

    seller_dni = filters.CharFilter(field_name="seller__dni", lookup_expr='icontains')
    """Filter for assignments by seller's DNI (case insensitive)."""

    class Meta:
        """
        Meta class for AssignmentFilter.
        """
        model = Assignment
        fields = ['start_date', 'end_date', 'seller_name', 'seller_last_name', 'seller_number_seller', 'seller_dni']