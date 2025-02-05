from rest_framework import viewsets, status
from django.utils import timezone
from seller.models import Seller
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from django_filters.rest_framework import DjangoFilterBackend

from assignment.models import Assignment
from assignment.serializer import AssignmentSerializer
from assignment.filters import AssignmentFilter
from core.pagination import CustomPagination
from detail_assignment.models import DetailAssignment

class AssignmentViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing assignment instances.
    """

    # JWT Authentication
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    queryset = Assignment.objects.all()
    serializer_class = AssignmentSerializer
    pagination_class = CustomPagination
    filter_backends = [DjangoFilterBackend]
    filterset_class = AssignmentFilter

    def total_pay(self, assignment):
        """
        Helper method to calculate total payment.

        Args:
            assignment (Assignment): The assignment instance.

        Returns:
            float: The total payment.
        """
        total_assignment = self.total_assignment(assignment)
        total_returned = self.total_returned(assignment)
        return total_assignment - total_returned

    def total_assignment(self, assignment):
        """
        Helper method to calculate total assignment value.

        Args:
            assignment (Assignment): The assignment instance.

        Returns:
            float: The total assignment value.
        """
        details_assignment = DetailAssignment.objects.filter(assignment=assignment)
        total = 0

        for detail_assignment in details_assignment:
            subtotal = detail_assignment.quantity * detail_assignment.unit_price
            total += subtotal

        return total

    def total_returned(self, assignment):
        """
        Helper method to calculate total returned value.

        Args:
            assignment (Assignment): The assignment instance.

        Returns:
            float: The total returned value.
        """
        details_assignment = DetailAssignment.objects.filter(assignment=assignment)
        total = 0
        for detail_assignment in details_assignment:
            subtotal = detail_assignment.returned_amount * detail_assignment.unit_price
            total += subtotal
        return total

    def destroy(self, request, *args, **kwargs):
        """
        Soft delete implementation.

        Args:
            request (Request): The request instance.
            *args: Variable length argument list.
            **kwargs: Arbitrary keyword arguments.

        Returns:
            Response: HTTP 204 NO CONTENT response.
        """
        instance = self.get_object()
        instance.soft_delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['get'], url_path='calculate-total-assignment')
    def get_total_assignment(self, request, pk=None):
        """
        Calculate total assignment value.

        Args:
            request (Request): The request instance.
            pk (int, optional): The primary key of the assignment.

        Returns:
            Response: The total assignment value.
        """
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
        """
        Calculate total returned value.

        Args:
            request (Request): The request instance.
            pk (int, optional): The primary key of the assignment.

        Returns:
            Response: The total returned value.
        """
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
        """
        Calculate total payment.

        Args:
            request (Request): The request instance.
            pk (int, optional): The primary key of the assignment.

        Returns:
            Response: The total payment.
        """
        assignment = self.get_object()
        total_pay = self.total_pay(assignment)

        return Response({
            'assignment_id': assignment.id,
            'seller': assignment.seller.name,
            'date': assignment.date_assignment,
            'status': assignment.status,
            'total_pay': total_pay
        }, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], url_path='create-assignments')
    def create_assignments(self, request):
        """
        Create assignments for all active sellers.

        Args:
            request (Request): The request instance.

        Returns:
            Response: The created assignments.
        """
        today = timezone.now().date()
        active_sellers = Seller.objects.filter(status=True)
        created_assignments = []
        existing_assignments = []

        for seller in active_sellers:
            assignment, created = Assignment.objects.get_or_create(
                date_assignment=today,
                seller=seller,
                defaults={'status': 'PENDING'}
            )
            if created:
                created_assignments.append(assignment)
            else:
                existing_assignments.append(assignment)

        serializer = AssignmentSerializer(created_assignments + existing_assignments, many=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)