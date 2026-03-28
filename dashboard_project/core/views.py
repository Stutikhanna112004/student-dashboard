from django.views.generic import TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.db.models import Avg
from django.shortcuts import render, redirect
from django.views import View
from django.contrib.auth import login, authenticate
from django.middleware.csrf import get_token
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .models import Enrollment, StudentProfile
from .forms import StudentSignUpForm

from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import Enrollment
import json


# ── CSRF token ────────────────────────────────────────────────────────────────
def csrf_token_view(request):
    token = get_token(request)
    return JsonResponse({"csrfToken": token})


# ── JSON login ────────────────────────────────────────────────────────────────
@csrf_exempt
def api_login_view(request):
    if request.method != "POST":
        return JsonResponse({"error": "Method not allowed"}, status=405)

    try:
        body = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    username = body.get("username", "").strip()
    password = body.get("password", "")

    if not username or not password:
        return JsonResponse({"error": "Username and password are required."}, status=400)

    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        return JsonResponse({"success": True, "username": user.username})
    else:
        return JsonResponse(
            {"success": False, "error": "Invalid username or password."},
            status=401
        )



# ── JSON signup ───────────────────────────────────────────────────────────────
@csrf_exempt
def api_signup_view(request):
    if request.method != "POST":
        return JsonResponse({"error": "Method not allowed"}, status=405)

    try:
        body = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    username  = body.get("username",  "").strip()
    email     = body.get("email",     "").strip()
    password1 = body.get("password1", "")
    password2 = body.get("password2", "")

    if not username or not password1:
        return JsonResponse({"error": "Username and password are required."}, status=400)
    if password1 != password2:
        return JsonResponse({"error": "Passwords do not match."}, status=400)
    if len(password1) < 8:
        return JsonResponse({"error": "Password must be at least 8 characters."}, status=400)
    if User.objects.filter(username=username).exists():
        return JsonResponse({"error": "Username already taken."}, status=400)

    user = User.objects.create_user(username=username, email=email, password=password1)
    login(request, user)
    return JsonResponse({"success": True, "username": user.username})

# ── Dashboard API ─────────────────────────────────────────────────────────────
# NOTE: We use session_id from cookie to identify the user.
# Since cross-origin cookies are unreliable in dev, we accept the
# username via query param as fallback, OR use request.user if session works.
@api_view(['GET'])
def dashboard_api(request):
    # Try session-based auth first
    if request.user.is_authenticated:
        user = request.user
    else:
        # Fallback: use username query param set by React after login
        username = request.GET.get('user')
        if not username:
            # Last resort: first user (dev only)
            user = User.objects.first()
            if not user:
                return Response({"error": "No users found"}, status=404)
        else:
            try:
                user = User.objects.get(username=username)
            except User.DoesNotExist:
                return Response({"error": "User not found"}, status=404)

    enrollments     = Enrollment.objects.filter(user=user)
    courses         = []
    grades          = []
    attendance_list = []

    for e in enrollments:
        courses.append({
            "course":     e.course.name,
            "grade":      e.grade,
            "attendance": e.attendance,
        })
        grades.append(e.grade)
        attendance_list.append(e.attendance)

    avg_grade      = sum(grades)          / len(grades)          if grades          else 0
    avg_attendance = sum(attendance_list) / len(attendance_list) if attendance_list else 0

    badges = []
    if avg_grade >= 85:
        badges.append("🏆 Top Performer")
    elif avg_grade < 50:
        badges.append("⚠️ Needs Improvement")
    if avg_attendance >= 90:
        badges.append("🔥 Consistent")
    if len(courses) >= 2:
        badges.append("📚 Active Learner")

    return Response({
        "username": user.username,
        "courses":  courses,
        "badges":   badges,
    })


# ── Sign-up ───────────────────────────────────────────────────────────────────
class SignUpView(View):
    def get(self, request):
        return render(request, 'core/register.html', {'form': StudentSignUpForm()})

    def post(self, request):
        form = StudentSignUpForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.set_password(form.cleaned_data['password1'])
            user.save()
            login(request, user)
            return redirect('dashboard')
        return render(request, 'core/register.html', {'form': form})


# ── Django-template dashboard ─────────────────────────────────────────────────
class DashboardView(LoginRequiredMixin, TemplateView):
    template_name = 'core/dashboard.html'

    def get_context_data(self, **kwargs):
        context        = super().get_context_data(**kwargs)
        enrollments    = Enrollment.objects.filter(user=self.request.user)
        profile, _     = StudentProfile.objects.get_or_create(user=self.request.user)
        total_courses  = enrollments.count()
        avg_grade      = enrollments.aggregate(Avg('grade'))['grade__avg']
        avg_attendance = enrollments.aggregate(Avg('attendance'))['attendance__avg']

        skill = (
            "Advanced"     if avg_grade and avg_grade >= 85 else
            "Intermediate" if avg_grade and avg_grade >= 60 else
            "Beginner"
        )

        badges = []
        if avg_grade:
            if avg_grade >= 85:  badges.append("🏆 Top Performer")
            elif avg_grade < 50: badges.append("⚠️ Needs Improvement")
        if avg_attendance and avg_attendance >= 90:
            badges.append("🔥 Consistent")
        if total_courses >= 3:
            badges.append("📚 Active Learner")

        context.update({
            'enrollments':      enrollments,
            'total_courses':    total_courses,
            'avg_grade':        avg_grade,
            'attendance_width': f"{avg_attendance or 0}%",
            'avg_attendance':   avg_attendance,
            'skill_level':      skill,
            'profile':          profile,
            'badges':           badges,
        })
        return context