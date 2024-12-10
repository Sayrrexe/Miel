from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from django.db.models.functions import TruncDay
from django.utils import timezone
from django.db.models import Count

from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.filters import SearchFilter
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from datetime import datetime

from . import models
from .utils import write_off_the_quota
from .serializers import (FavoriteSerializer, 
                          TodoSerializer,  
                          InfoAboutSupervisor,             
                          CandidateSerializer, 
                          InvitationSerializer,
                          SupervisorSerializer)


# Create your views here.
@login_required
def index(request):
    user = request.user
    return redirect('/admin/')


class GetSupervisorInfoView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        queryset = models.Supervisor.objects.filter(user=request.user)

        serializer = InfoAboutSupervisor(queryset, many=True)
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
        
class TodoStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        now = timezone.now()
        user = request.user

        # Получаем параметры start_date и end_date из GET-запроса
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        # Преобразуем параметры в datetime
        if start_date:
            start_date = timezone.make_aware(datetime.strptime(start_date, '%Y-%m-%d'))
        if end_date:
            end_date = timezone.make_aware(datetime.strptime(end_date, '%Y-%m-%d'))

        # Фильтруем задачи пользователя
        todos_filter = models.Todo.objects.filter(user=user)

        if start_date:
            todos_filter = todos_filter.filter(date_creation__gte=start_date)
        if end_date:
            todos_filter = todos_filter.filter(date_creation__lte=end_date)

        # 1. Всего создано
        total_created = todos_filter.count()

        # 2. Завершено
        total_completed = todos_filter.filter(is_complete=True).count()

        # 3. Удалено
        total_deleted = todos_filter.filter(is_deleted=True).count()

        # 4. День недели с максимальными созданиями
        max_created_day = (
            todos_filter.annotate(day=TruncDay('date_creation'))
            .values('day')
            .annotate(count=Count('id'))
            .order_by('-count')
            .first()
        )

        # 5. День недели с максимальными завершениями
        completed_by_day = (
            todos_filter.filter(is_complete=True)
            .annotate(day=TruncDay('date_complete'))
            .values('day')
            .annotate(count=Count('id'))
            .order_by('-count')
        )
        max_completed_day = completed_by_day.first()

        # Статистика
        stats = {
            'total_created': total_created,
            'total_completed': total_completed,
            'total_deleted': total_deleted,
            'max_created_day': max_created_day['day'].strftime('%A') if max_created_day else 'No data',
            'max_completed_day': max_completed_day['day'].strftime('%A') if max_completed_day else 'No data',
        }

        return Response(stats, status=status.HTTP_200_OK)
    
class SupervisorViewSet(ModelViewSet):
    queryset = models.Supervisor.objects.select_related('user', 'office').all()
    serializer_class = SupervisorSerializer
    filter_backends = [SearchFilter]
    search_fields = ['user__first_name', 'user__last_name',]

