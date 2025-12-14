from django.db.models import Sum, F, ExpressionWrapper, DecimalField
from django.db.models.functions import TruncMonth, TruncDay
from rest_framework import viewsets, status
from django.utils import timezone
from datetime import datetime
import calendar
from datetime import timedelta
from seller.models import Seller
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from django_filters.rest_framework import DjangoFilterBackend
import pytz
from django.core.cache import cache
import json

from assignment.models import Assignment
from assignment.serializer import AssignmentSerializer
from assignment.filters import AssignmentFilter
from core.pagination import CustomPagination
from core.cache_mixin import CacheMixin
from detail_assignment.models import DetailAssignment


class AssignmentViewSet(CacheMixin, viewsets.ModelViewSet):
    """
    A viewset for viewing and editing assignment instances.
    """

    # Cache configuration
    cache_key_prefix = 'assignments'
    cache_timeout = 3600  # 1 hour

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
        peru_tz = pytz.timezone('America/Lima')
        
        now_in_peru = datetime.now(peru_tz)
        
        today = now_in_peru.date()

        active_sellers = Seller.objects.filter(status=True)
        created_assignments = []
        existing_assignments = []

        for seller in active_sellers:
            assignment, created = Assignment.objects.get_or_create(
                date_assignment=today,
                seller=seller
            )

            if created:
                created_assignments.append(assignment)
            else:
                existing_assignments.append(assignment)

        # Invalidate cache after creation
        from core.cache_utils import invalidate_model_cache
        invalidate_model_cache(self.cache_key_prefix)

        serializer = AssignmentSerializer(created_assignments + existing_assignments, many=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['delete'], url_path='delete-assignments')
    def delete_assignments(self, request):
        peru_tz = pytz.timezone('America/Lima')
        today = timezone.now().astimezone(peru_tz).date()
        all_assignments = Assignment.objects.filter(date_assignment=today)

        for assignment in all_assignments:
            assignment.soft_delete()

        # Invalidate cache after bulk deletion
        from core.cache_utils import invalidate_model_cache
        invalidate_model_cache(self.cache_key_prefix)

        return Response(status=status.HTTP_200_OK)

class ReportViewSet(viewsets.ViewSet):
    """
    A viewset for viewing and generating reports.
    """

    # JWT Authentication
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'], url_path='sales-by-seller')
    def sales_by_seller(self, request):
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        if not start_date or not end_date:
            return Response({"error": "start_date and end_date are required"}, status=status.HTTP_400_BAD_REQUEST)

        report = DetailAssignment.objects.filter(
            assignment__date_assignment__range=[start_date, end_date]
        ).values(
            'assignment__seller__name'
        ).annotate(
            total_sold=Sum(F('quantity') - F('returned_amount')),
            total_amount=Sum(ExpressionWrapper((F('quantity') - F('returned_amount')) * F('unit_price'),
                                               output_field=DecimalField()))
        ).order_by('-total_amount')

        return Response(report, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='top-newspapers')
    def top_newspapers(self, request):
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        if not start_date or not end_date:
            return Response({"error": "start_date and end_date are required"}, status=status.HTTP_400_BAD_REQUEST)

        report = DetailAssignment.objects.filter(
            assignment__date_assignment__range=[start_date, end_date],
            product__type_product__type='NEWSPAPER'
        ).values(
            'product__name'
        ).annotate(
            total_sold=Sum('quantity'),
            total_amount=Sum(ExpressionWrapper(F('quantity') * F('unit_price'), output_field=DecimalField()))
        ).order_by('-total_sold')

        return Response(report, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='top-products')
    def top_products(self, request):
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        if not start_date or not end_date:
            return Response({"error": "start_date and end_date are required"}, status=status.HTTP_400_BAD_REQUEST)

        report = DetailAssignment.objects.filter(
            assignment__date_assignment__range=[start_date, end_date],
            product__type_product__type='PRODUCT'
        ).values(
            'product__name'
        ).annotate(
            total_sold=Sum('quantity'),
            total_amount=Sum(ExpressionWrapper(F('quantity') * F('unit_price'), output_field=DecimalField()))
        ).order_by('-total_sold')

        return Response(report, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='returns-and-efficiency')
    def returns_and_efficiency(self, request):
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        if not start_date or not end_date:
            return Response({"error": "start_date and end_date are required"}, status=status.HTTP_400_BAD_REQUEST)

        report = DetailAssignment.objects.filter(
            assignment__date_assignment__range=[start_date, end_date]
        ).values(
            'assignment__seller__name'
        ).annotate(
            total_sold=Sum('quantity'),
            total_returned=Sum('returned_amount'),
            return_percentage=ExpressionWrapper(
                F('total_returned') * 100.0 / F('total_sold'), output_field=DecimalField()
            ),
            impact_on_sales=Sum(
                ExpressionWrapper(
                    F('returned_amount') * F('unit_price'), output_field=DecimalField()
                )
            )
        ).order_by('assignment__seller__name')

        return Response(report, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='profits')
    def profits(self, request):
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        if not start_date or not end_date:
            return Response({"error": "start_date and end_date are required"}, status=status.HTTP_400_BAD_REQUEST)

        report = DetailAssignment.objects.filter(
            assignment__date_assignment__range=[start_date, end_date]
        ).values(
            'assignment__seller__name'
        ).annotate(
            total_profit=Sum(
                ExpressionWrapper(
                    F('quantity') * F('unit_price') - F('returned_amount') * F('unit_price'),
                    output_field=DecimalField()
                )
            )
        ).order_by('-total_profit')

        return Response(report, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='monthly-earnings')
    def monthly_earnings(self, request):
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        if not start_date or not end_date:
            return Response({"error": "start_date and end_date are required"}, status=status.HTTP_400_BAD_REQUEST)

        report = DetailAssignment.objects.filter(
            assignment__date_assignment__range=[start_date, end_date]
        ).annotate(
            month=TruncMonth('assignment__date_assignment')
        ).values(
            'month'
        ).annotate(
            total_earnings=Sum(ExpressionWrapper(
                (F('quantity') - F('returned_amount')) * F('unit_price'),
                output_field=DecimalField()
            ))
        ).order_by('month')

        # Format the month to the last day of the month
        formatted_report = []
        for entry in report:
            month = entry['month']
            last_day_of_month = month.replace(day=calendar.monthrange(month.year, month.month)[1])
            formatted_report.append({
                'month': last_day_of_month,
                'total_earnings': entry['total_earnings']
            })

        return Response(formatted_report, status=status.HTTP_200_OK)
    

    @action(detail=False, methods=['get'], url_path='dayly-earnings')
    def dayly_earnings(self, request):
        
        peru_tz = pytz.timezone('America/Lima')
        today = timezone.now().astimezone(peru_tz).date()

        report = DetailAssignment.objects.filter(
            assignment__date_assignment=today
        ).annotate(
            day=TruncDay('assignment__date_assignment')
        ).values(
            'day'
        ).annotate(
            total_earnings=Sum(ExpressionWrapper(
                (F('quantity') - F('returned_amount')) * F('unit_price'),
                output_field=DecimalField()
            ))
        ).order_by('day')

        formatted_report = []
        for entry in report:
            formatted_report.append({
                'day': entry['day'],
                'total_earnings': entry['total_earnings']
            })

        return Response(formatted_report, status=status.HTTP_200_OK)