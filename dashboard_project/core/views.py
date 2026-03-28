from django.views.generic import TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.db.models import Avg
from django.shortcuts import render, redirect
from django.views import View
from django.contrib.auth import login, authenticate

from .models import Enrollment, StudentProfile
from .forms import StudentSignUpForm

from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User


class CsrfExemptSessionAuthentication(SessionAuthentication):
    """Skip DRF's duplicate CSRF check — Django middleware already handles it."""
    def enforce_csrf(self, request):
        return


@api_view(['POST'])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([AllowAny])
def login_api(request):
    username = request.data.get('username', '').strip()
    password = request.data.get('password', '')

    if not username or not password:
        return Response({'success': False, 'error': 'Username and password are required.'}, status=400)

    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        return Response({'success': True, 'username': user.username})
    return Response({'success': False, 'error': 'Invalid username or password.'}, status=401)


@api_view(['GET'])
@authentication_classes([CsrfExemptSessionAuthentication])
def dashboard_api(request):
    user = request.user
    if not user.is_authenticated:
        return Response({'error': 'Not authenticated'}, status=401)

    enrollments = Enrollment.objects.filter(user=user).select_related('course')
    courses, grades, attendance_list = [], [], []

    for e in enrollments:
        courses.append({'course': e.course.name, 'grade': e.grade, 'attendance': e.attendance})
        grades.append(e.grade)
        attendance_list.append(e.attendance)

    avg_grade      = round(sum(grades) / len(grades), 1) if grades else 0
    avg_attendance = round(sum(attendance_list) / len(attendance_list), 1) if attendance_list else 0

    badges = []
    if avg_grade >= 85: badges.append('🏆 Top Performer')
    elif avg_grade < 50 and grades: badges.append('⚠️ Needs Improvement')
    if avg_attendance >= 90: badges.append('🔥 Consistent')
    if len(courses) >= 2: badges.append('📚 Active Learner')

    return Response({
        'username': user.username,
        'courses': courses,
        'badges': badges,
        'avg_grade': avg_grade,
        'avg_attendance': avg_attendance,
        'total_courses': len(courses),
    })


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


class DashboardView(LoginRequiredMixin, TemplateView):
    template_name = 'core/dashboard.html'
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        enrollments = Enrollment.objects.filter(user=self.request.user)
        profile, _  = StudentProfile.objects.get_or_create(user=self.request.user)
        total_courses  = enrollments.count()
        avg_grade      = enrollments.aggregate(Avg('grade'))['grade__avg']
        avg_attendance = enrollments.aggregate(Avg('attendance'))['attendance__avg']
        skill = ('Advanced' if avg_grade >= 85 else 'Intermediate' if avg_grade >= 60 else 'Beginner') if avg_grade else 'Beginner'
        badges = []
        if avg_grade:
            if avg_grade >= 85: badges.append('🏆 Top Performer')
            elif avg_grade < 50: badges.append('⚠️ Needs Improvement')
        if avg_attendance and avg_attendance >= 90: badges.append('🔥 Consistent')
        if total_courses >= 3: badges.append('📚 Active Learner')
        context.update({'enrollments': enrollments, 'total_courses': total_courses, 'avg_grade': avg_grade,
            'avg_attendance': avg_attendance, 'attendance_width': f'{avg_attendance or 0}%',
            'skill_level': skill, 'profile': profile, 'badges': badges})
        return context