from django.urls import path
from django.contrib.auth.views import LoginView, LogoutView
from django.views.generic import RedirectView

from .views import DashboardView, SignUpView, dashboard_api, login_api

urlpatterns = [
    # Django template routes
    path('',           RedirectView.as_view(url='/login/', permanent=False)),
    path('login/',     LoginView.as_view(template_name='core/login.html'), name='login'),
    path('logout/',    LogoutView.as_view(), name='logout'),
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
    path('signup/',    SignUpView.as_view(), name='signup'),

    # React / DRF API routes
    path('api/login/',     login_api,     name='api-login'),
    path('api/dashboard/', dashboard_api, name='api-dashboard'),
]