from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Sum, Q
from decimal import Decimal

from .models import Finance
from .serializer import FinanceSerializer
from .filters import FinanceFilter
from core.pagination import CustomPagination
from core.cache_mixin import CacheMixin


# Create your views here.
class FinanceViewSet(CacheMixin, viewsets.ModelViewSet):
    # Cache configuration
    cache_key_prefix = 'finances'
    cache_timeout = 3600

    # JWT Authentication
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]    

    queryset = Finance.objects.all().order_by('-date_finance')
    serializer_class = FinanceSerializer
    pagination_class = CustomPagination

    # Settings of filters
    filter_backends = [DjangoFilterBackend]
    filterset_class = FinanceFilter

    @action(detail=False, methods=['get'], url_path='cash-balance')
    def cash_balance(self, resquest):
        """
        Calculate the actual balance of cash (income - expense)
        """

        # Add incomes
        income = Finance.objects.filter(
            type_operation = 'INCOME'
        ).aggregate(total=Sum('amount'))['total'] or Decimal('0')

        # Add expenses
        expense = Finance.objects.filter(
            type_operation='EXPENSE'
        ).aggregate(total=Sum('amount'))['total'] or Decimal('0')

        # Calculate the balance
        balance = income - expense

        return Response({
            'total_income': income,
            'total_expense': expense,
            'cash_balance': balance,
            'status': 'positive' if balance >= 0 else 'negative'
        })
    
    @action(detail=False, methods=['get'], url_path='daily-sumary')
    def daily_sumary(self, request):
        """
        Daily sumary of income and expense
        """
        date = request.query_params.get('date')
        if not date:
            return Response(
                {'error': 'The dare parameter (YYYY-MM-DD) is required'}
            )

        # Filter by specific date
        daily_transactions = Finance.objects.filter(date_finance=date)

        # Calculate totals day
        income_day = daily_transactions.filter(
            type_operation='INCOME'
        ).aggregate(total=Sum('amount'))['total'] or Decimal('0')

        expense_day = daily_transactions.filter(
            type_operation='EXPENSE'
        ).aggregate(total=Sum('amount'))['total'] or Decimal('0')

        balance_day = income_day - expense_day

        return Response({
            'date': date,
            'income_day': income_day,
            'expense_day': expense_day,
            'balance_day': balance_day,
            'transaction_count': daily_transactions.count()
        })
    
    @action(detail=False, methods=['get'], url_path='monthly-summary')
    def monthly_summary(self, request):
        """
        Month summary of income and expense
        """

        year = request.query_params.get('year')
        month = request.query_params.get('month')

        if not year or not month:
            return Response(
                {'error': 'The year and month parameter is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        monthly_transactions = Finance.objects.filter(
            date_finance__year=year,
            date_finance__month=month
        )

        # Calculate total of month
        income_month = monthly_transactions.filter(
            type_operation = 'INCOME'
        ).aggregate(total=Sum('amount'))['total'] or Decimal('0')

        expense_month = monthly_transactions.filter(
            type_operation = 'EXPENSE'
        ).aggregate(total=Sum('amount'))['total'] or Decimal('0')

        balance_month = income_month - expense_month

        return Response({
            'year': year,
            'month': month,
            'income_month': income_month,
            'expense_month': expense_month,
            'balance_month': balance_month,
            'transactions_count': monthly_transactions.count()
        })