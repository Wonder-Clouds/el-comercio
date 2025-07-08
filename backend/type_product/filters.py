import django_filters
from .models import TypeProduct


class TypeProductFilter(django_filters.FilterSet):
    """
    FilterSet for the TypeProduct model that allows filtering by:
    - Specific name or partial match
    """

    # Filter by specific name or partial match
    name = django_filters.CharFilter(lookup_expr='icontains')
    type = django_filters.ChoiceFilter(choices=TypeProduct.TYPE)

    class Meta:
        model = TypeProduct
        fields = ['name', 'type']