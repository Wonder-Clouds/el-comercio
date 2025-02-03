from rest_framework.pagination import PageNumberPagination

class CustomPagination(PageNumberPagination):
    """
    Custom pagination class that extends PageNumberPagination.

    Attributes:
        page_size (int): The default number of items per page.
        page_size_query_param (str): The query parameter name for specifying the page size.
    """
    page_size = 10
    page_size_query_param = 'page_size'