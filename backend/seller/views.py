from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.db.models import Q

from core.pagination import CustomPagination
from seller.models import Seller
from seller.serializer import SellerSerializer
from assignment.models import Assignment
from assignment.serializer import AssignmentSerializer

class SellerViewSet(viewsets.ModelViewSet):
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
            
        # Filtramos los registros no eliminados (donde delete_at es None)
        return queryset.filter(delete_at__isnull=True)

    # Delete Method
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.soft_delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['get'], url_path='unpaid-assignment')
    def unpaid_assignment(self, request, pk=None):
        seller = self.get_object()
        assignments = Assignment.objects.filter(seller=seller, status='PENDING')
        serializer = AssignmentSerializer(assignments, many=True)
        return Response(serializer.data)