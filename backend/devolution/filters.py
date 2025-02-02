import django_filters
from .models import Devolution

class DevolutionFilter(django_filters.FilterSet):
    start_date = django_filters.DateFilter(field_name="date_devolution", lookup_expr='gte')
    end_date = django_filters.DateFilter(field_name="date_devolution", lookup_expr='lte')
    seller_name = django_filters.CharFilter(field_name="seller__name", lookup_expr='icontains')
    product_name = django_filters.CharFilter(field_name="product__name", lookup_expr='icontains')
    status = django_filters.CharFilter(field_name="status", lookup_expr='icontains')

    class Meta:
        model = Devolution
        fields = ['start_date', 'end_date', 'seller_name', 'product_name', 'status']