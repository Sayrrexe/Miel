from urllib import request
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .serializers import FavoriteSerializer, TodoSerializer, SupervisorSerializer,CandidateSerializer, InvitationSerializer
from . import models
from .utils import Office, Transaction, write_off_the_quota
from rest_framework.permissions import IsAuthenticated


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
    permission_classes = [IsAuthenticated]
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
    permission_classes = [IsAuthenticated]
    queryset = models.Candidate.objects.filter(is_active=True, is_free = True)
    model = models.Candidate
    serializer_class = CandidateSerializer


class InvitationAPIView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = InvitationSerializer
    model = models.Invitation
    
    def get(self, request):
        supervisor = models.Supervisor.objects.filter(user=request.user).first()
        if not supervisor:
            return Response({'error': 'Supervisor not found'}, status=status.HTTP_400_BAD_REQUEST)
    
        office = supervisor.office
        queryset = models.Invitation.objects.filter(office=office).all()
    
        serializer = InvitationSerializer(queryset, many=True)
        return Response(serializer.data)

    
    def post(self, request):
        supervisor = models.Supervisor.objects.filter(user=self.request.user).first()
        if not supervisor:
            return Response({'error': 'Supervisor not found'}, status=status.HTTP_400_BAD_REQUEST)
        
        
        office = supervisor.office

        candidate_id = request.data.get('candidate')
        if not candidate_id:
            return Response({'error': 'Candidate ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            candidate_id = int(candidate_id)
        except ValueError:
            return Response({'error': 'Invalid Candidate ID'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Проверяем, приглашали ли уже кандидата
        existing_invitation = models.Invitation.objects.filter(candidate_id=candidate_id, office=office).first()
        if existing_invitation:
            return Response(
                {'error': f'Candidate {candidate_id} has already been invited.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = InvitationSerializer(data=request.data)
        
        if serializer.is_valid():
            cause = f'Приглашение кандидата {candidate_id}'
            transaction, error = write_off_the_quota(office_id=office.id, amount=1, cause=cause)
            if transaction:
                serializer.save(office=office)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response({'error': error}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
class FavoriteViewSet(ModelViewSet):
    serializer_class = FavoriteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return models.Favorite.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

