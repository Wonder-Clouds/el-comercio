from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.db.models import Q

from core.pagination import CustomPagination
from core.cache_mixin import CacheMixin
from detail_assignment.models import DetailAssignment
from detail_assignment.serializer import DetailAssignmentSerializer
from seller.models import Seller
from seller.serializer import SellerSerializer

class SellerViewSet(CacheMixin, viewsets.ModelViewSet):
    # Cache configuration
    cache_key_prefix = 'sellers'
    cache_timeout = 3600

    # JWT Authentication
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    queryset = Seller.objects.all()
    serializer_class = SellerSerializer
    pagination_class = CustomPagination

    def get_queryset(self):
        queryset = super().get_queryset()
        search = self.request.query_params.get('search', None)

        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(last_name__icontains=search) |
                Q(dni__icontains=search) |
                Q(number_seller__icontains=search)
            ).distinct()

        return queryset.filter(delete_at__isnull=True)

    # Delete Method
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.soft_delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['get'], url_path='unpaid-assignment')
    def unpaid_assignment(self, request):
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        # Filter the assigment by seller
        if start_date and end_date:
            detail_assignments = DetailAssignment.objects.filter(
                status='PENDING',
                return_date__range=[start_date, end_date]
            )
        else:
            detail_assignments = DetailAssignment.objects.filter(
                status='PENDING'
            )

        # Group the assigment by seller
        sellers = Seller.objects.filter(delete_at__isnull=True)
        result = []

        for seller in sellers:
            seller_assignments = detail_assignments.filter(assignment__seller=seller)

            result.append({
                'seller_id': seller.id,
                'seller_name': f"{seller.name} {seller.last_name}",
                'seller_code': seller.number_seller,
                'seller_dni': seller.dni,
                'seller_phone': seller.phone,
                'seller_status': seller.status,
                'assignments': DetailAssignmentSerializer(seller_assignments, many=True).data
            })

        return Response(result, status=status.HTTP_200_OK)