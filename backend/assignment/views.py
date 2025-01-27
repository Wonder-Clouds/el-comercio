from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication

from assignment.models import Assignment
from assignment.serializer import AssignmentSerializer
from core.pagination import CustomPagination
from detail_assignment.models import DetailAssignment


class AssignmentViewSet(viewsets.ModelViewSet):
    # JWT Authentication
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]


    queryset = Assignment.objects.filter(delete_at__isnull=True)
    serializer_class = AssignmentSerializer
    pagination_class = CustomPagination

    def total_pay(self, assignment):
        """Helper method to calculate total payment"""
        total_assignment = self.total_assignment(assignment)
        total_returned = self.total_returned(assignment)
        return total_assignment - total_returned

    def total_assignment(self, assignment):
        """Helper method to calculate total assignment value"""
        details_assignment = DetailAssignment.objects.filter(assignment=assignment)
        total = 0

        for detail_assignment in details_assignment:
            subtotal = detail_assignment.quantity * detail_assignment.unit_price
            total += subtotal

        return total

    def total_returned(self, assignment):
        """Helper method to calculate total returned value"""
        details_assignment = DetailAssignment.objects.filter(assignment=assignment)
        total = 0
        for detail_assignment in details_assignment:
            subtotal = detail_assignment.returned_amount * detail_assignment.unit_price
            total += subtotal
        return total

    def destroy(self, request, *args, **kwargs):
        """Soft delete implementation"""
        instance = self.get_object()
        instance.soft_delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['get'], url_path='calculate-total-assignment')
    def get_total_assignment(self, request, pk=None):
        assignment = self.get_object()
        total_assignment = self.total_assignment(assignment)

        return Response({
            'assignment_id': assignment.id,
            'seller': assignment.seller.name,
            'date': assignment.date_assignment,
            'status': assignment.status,
            'total': total_assignment
        }, status=status.HTTP_200_OK)

    @action(detail=True, methods=['get'], url_path='calculate-total-returned')
    def get_total_returned(self, request, pk=None):
        assignment = self.get_object()
        total_returned = self.total_returned(assignment)

        return Response({
            'assignment_id': assignment.id,
            'seller': assignment.seller.name,
            'date': assignment.date_assignment,
            'status': assignment.status,
            'total': total_returned
        }, status=status.HTTP_200_OK)

    @action(detail=True, methods=['get'], url_path='calculate-total-pay')
    def get_total_pay(self, request, pk=None):
        assignment = self.get_object()
        total_pay = self.total_pay(assignment)

        return Response({
            'assignment_id': assignment.id,
            'seller': assignment.seller.name,
            'date': assignment.date_assignment,
            'status': assignment.status,
            'total_pay': total_pay
        }, status=status.HTTP_200_OK)
