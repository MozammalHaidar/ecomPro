from django.urls import path
from .views import (
    OrderListView,
    OrderDetailView,
    CreateOrderView,
    UpdateOrderStatusView,
    CancelOrderView,
    AdminStatsView,
    SalesChartView,
    AdminDeleteOrderView,
)

urlpatterns = [
    path('', OrderListView.as_view(), name='order-list'),
    path('create/', CreateOrderView.as_view(), name='order-create'),
    path('stats/', AdminStatsView.as_view(), name='admin-stats'),
    path('chart/', SalesChartView.as_view(), name='sales-chart'),
    path('<int:pk>/', OrderDetailView.as_view(), name='order-detail'),
    path('<int:pk>/status/', UpdateOrderStatusView.as_view(), name='order-status'),
    path('<int:pk>/cancel/', CancelOrderView.as_view(), name='order-cancel'),
    path('<int:pk>/delete/', AdminDeleteOrderView.as_view(), name='order-delete'),
]
