import django_filters
from .models import Product

class ProductFilter(django_filters.FilterSet):
    # Filter by type product
    product_type = django_filters.CharFilter(field_name="type_product__type", lookup_expr='icontains')
    
    # Filter by name of product
    product_name = django_filters.CharFilter(field_name="name", lookup_expr='icontains')
    
    # Filter by state of product
    status_product = django_filters.BooleanFilter(field_name="status_product")
    
    # Filters by range of prices
    min_price = django_filters.NumberFilter(field_name="product_price", lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name="product_price", lookup_expr='lte')
    
    # Filter by minimum quantity
    min_quantity = django_filters.NumberFilter(field_name="total_quantity", lookup_expr='gte')
    
    # Filter by date creation
    created_date = django_filters.DateFilter(field_name="create_at__date")
    created_date_from = django_filters.DateFilter(field_name="create_at__date", lookup_expr='gte')
    created_date_to = django_filters.DateFilter(field_name="create_at__date", lookup_expr='lte')

    class Meta:
        model = Product
        fields = [
            'product_type', 
            'product_name', 
            'status_product',
            'min_price',
            'max_price',
            'min_quantity',
            'created_date',
            'created_date_from',
            'created_date_to'
        ]