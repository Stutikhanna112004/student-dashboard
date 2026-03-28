from django.urls import path
from django.contrib.auth.views import LoginView, LogoutView
from django.views.generic import RedirectView
from .views import DashboardView, SignUpView, dashboard_api
from .views import csrf_token_view, api_login_view, api_signup_view

urlpatterns = [
    # ── Django-template routes (kept for admin access) ────────────────────────
    path('',          RedirectView.as_view(url='/login/', permanent=False)),
    path('login/',    LoginView.as_view(template_name='core/login.html'), name='login'),
    path('logout/',   LogoutView.as_view(), name='logout'),
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
    path('signup/',   SignUpView.as_view(), name='signup'),

    # ── React JSON API routes ─────────────────────────────────────────────────
    path('api/csrf/',      csrf_token_view,  name='api-csrf'),
    path('api/login/',     api_login_view,   name='api-login'),
    path('api/signup/',    api_signup_view,  name='api-signup'),   # ← NEW
    path('api/dashboard/', dashboard_api,    name='dashboard-api'),
]