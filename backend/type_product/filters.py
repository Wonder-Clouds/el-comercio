import django_filters
from .models import TypeProduct


class TypeProductFilter(django_filters.FilterSet):
    """
    FilterSet for the TypeProduct model that allows filtering by:
    - Specific name or partial match
    - Type of product
    - Price ranges for each day of the week
    """

    # Filter by specific name or partial match
    name = django_filters.CharFilter(lookup_expr='icontains')
    type = django_filters.ChoiceFilter(choices=TypeProduct.TYPE)
    
    # Price range filters for each day
    min_monday_price = django_filters.NumberFilter(field_name='monday_price', lookup_expr='gte')
    max_monday_price = django_filters.NumberFilter(field_name='monday_price', lookup_expr='lte')
    min_tuesday_price = django_filters.NumberFilter(field_name='tuesday_price', lookup_expr='gte')
    max_tuesday_price = django_filters.NumberFilter(field_name='tuesday_price', lookup_expr='lte')
    min_wednesday_price = django_filters.NumberFilter(field_name='wednesday_price', lookup_expr='gte')
    max_wednesday_price = django_filters.NumberFilter(field_name='wednesday_price', lookup_expr='lte')
    min_thursday_price = django_filters.NumberFilter(field_name='thursday_price', lookup_expr='gte')
    max_thursday_price = django_filters.NumberFilter(field_name='thursday_price', lookup_expr='lte')
    min_friday_price = django_filters.NumberFilter(field_name='friday_price', lookup_expr='gte')
    max_friday_price = django_filters.NumberFilter(field_name='friday_price', lookup_expr='lte')
    min_saturday_price = django_filters.NumberFilter(field_name='saturday_price', lookup_expr='gte')
    max_saturday_price = django_filters.NumberFilter(field_name='saturday_price', lookup_expr='lte')
    min_sunday_price = django_filters.NumberFilter(field_name='sunday_price', lookup_expr='gte')
    max_sunday_price = django_filters.NumberFilter(field_name='sunday_price', lookup_expr='lte')

    class Meta:
        model = TypeProduct
        fields = [
            'name', 'type',
            'min_monday_price', 'max_monday_price',
            'min_tuesday_price', 'max_tuesday_price', 
            'min_wednesday_price', 'max_wednesday_price',
            'min_thursday_price', 'max_thursday_price',
            'min_friday_price', 'max_friday_price',
            'min_saturday_price', 'max_saturday_price',
            'min_sunday_price', 'max_sunday_price'
        ]