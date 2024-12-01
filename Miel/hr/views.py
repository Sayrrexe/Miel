from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .serializers import TodoSerializer, SupervisorSerializer,CandidateSerializer
from . import models


# Create your views here.
@login_required
def index(request):
    user = request.user
    if user is not None:
        moderator = models.Moderator.objects.filter(user=user).exists()
        if moderator:
            return redirect('moderator_dashboard')
        supervisor = models.Supervisor.objects.filter(user=user).exists()
        if supervisor:
            return redirect('dashboard')
    return render(request, 'hr/errors/notuser.html')


@login_required
def dashboard(request):
    user = request.user
    return render(request, 'hr/supervisor/dashboard.html', )


@login_required
def moderator_dashboard(request):
    user = request.user
    return render(request, 'hr/moderator/dashboard-moderator.html', )


@login_required
def moderator_acrhive(request):
    user = request.user
    return render(request, 'hr/moderator/archive-moderator.html', )


@login_required
def moderator_offices_list(request):
    user = request.user
    return render(request, 'hr/moderator/office/starts-office.html', )


@login_required
def moderator_office_add(request):
    user = request.user
    return render(request, 'hr/moderator/office/add-office.html', )


@login_required
def moderator_office_delete(request):
    user = request.user
    return render(request, 'hr/moderator/office/remove-office.html', )


@login_required
def moderator_office_edit(request):
    user = request.user
    return render(request, 'hr/moderator/office/edit-office.html', )


@login_required
def moderator_supervisors_list(request):
    user = request.user
    return render(request, 'hr/moderator/supervisors/start-supervisor.html', )


@login_required
def moderator_supervisor_add(request):
    user = request.user
    return render(request, 'hr/moderator/supervisors/add-supervisor.html', )


@login_required
def moderator_supervisor_delete(request):
    user = request.user
    return render(request, 'hr/moderator/supervisors/remove-supervisor.html', )


@login_required
def moderator_supervisor_edit(request):
    user = request.user
    return render(request, 'hr/moderator/supervisors/edit-supervisor.html', )


@login_required
def moderator_candidates_list(request):
    user = request.user
    return render(request, 'hr/moderator/candidates/start-candidates.html', )


@login_required
def moderator_candidate_add(request):
    user = request.user
    return render(request, 'hr/moderator/candidates/add-candidates.html', )


@login_required
def moderator_candidate_delete(request):
    user = request.user
    return render(request, 'hr/moderator/candidates/remove-candidates.html', )


@login_required
def moderator_candidate_edit(request):
    user = request.user
    return render(request, 'hr/moderator/candidates/edit-candidates.html', )


@login_required
def moderator_lk(request):
    user = request.user
    return render(request, 'hr/moderator/lk.html', )


@login_required
def moderator_statistics(request):
    user = request.user
    return render(request, 'hr/moderator/static-analitic.html', )


@login_required
def moderator_quotes(request):
    user = request.user
    return render(request, 'hr/moderator/quotas.html', )


@login_required
def supervisor_lk(request):
    user = request.user
    return render(request, 'hr/supervisor/lk.html', )



class GetSupervisorInfoView(APIView):
    def get(self, request):
        queryset = models.Supervisor.objects.filter(user=request.user)

        serializer = SupervisorSerializer(queryset, many=True)
        return Response(serializer.data)

class TodoViewSet(ModelViewSet):
    queryset = models.Todo.objects.all()
    serializer_class = TodoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Переопределяем метод для фильтрации задач по текущему пользователю.
        """
        return models.Todo.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """
        Устанавливаем текущего пользователя как владельца задачи.
        """
        serializer.save(user=self.request.user)



class CandidateInfoView(ListAPIView):
    queryset = models.Candidate.objects.all()
    model = models.Candidate
    serializer_class = CandidateSerializer

