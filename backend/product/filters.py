import django_filters
from .models import Product

class ProductFilter(django_filters.FilterSet):
    product_type = django_filters.CharFilter(field_name="type", lookup_expr='icontains')
    product_name = django_filters.CharFilter(field_name="name", lookup_expr='icontains')

    class Meta:
        model = Product
        fields = ['product_type', 'product_name']