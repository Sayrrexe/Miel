from re import sub
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

from datetime import datetime

from .permissions import IsModerator, IsSupervisor
from . import models
from .utils import write_off_the_quota
from .serializers import (FavoriteSerializer, InfoAboutAdmin, 
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


class GetUserInfoView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            # Проверяем, является ли пользователь Moderator
            queryset = models.Moderator.objects.filter(user=request.user)
            if queryset.exists():
                serializer = InfoAboutAdmin(queryset, many=True)
                return Response(serializer.data)
        except models.Moderator.DoesNotExist:
            pass  
        
        
        try:
            # Проверяем, является ли пользователь Supervisor
            queryset = models.Supervisor.objects.filter(user=request.user)
            if queryset.exists():
                serializer = InfoAboutSupervisor(queryset, many=True)
                return Response(serializer.data)
        except models.Supervisor.DoesNotExist:
            pass  


        return Response({'error': 'The user is not a member of staff.'}, status=status.HTTP_400_BAD_REQUEST)

                
                
                

        

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

class InvitationAPIView(APIView):
    permission_classes = [IsSupervisor]
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
    permission_classes = [IsSupervisor]

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
    permission_classes = [IsModerator]
    queryset = models.Supervisor.objects.select_related('user', 'office').all()
    serializer_class = SupervisorSerializer
    filter_backends = [SearchFilter]
    search_fields = ['user__first_name', 'user__last_name',]

class CandidateViewSet(ModelViewSet):
    permission_classes = [IsModerator]
    queryset = models.Candidate.objects.all()
    serializer_class = CandidateSerializer

    def get_queryset(self):
        """
        Переопределение метода для ручной обработки параметров фильтрации.
        """
        queryset = super().get_queryset()
        is_free = self.request.query_params.get('is_free')
        name = self.request.query_params.get('search')

        if is_free is not None:
            # Фильтрация по "свободен?"
            queryset = queryset.filter(is_free=is_free.lower() == 'true')

        if name:
            # Поиск по имени (регистронезависимый)
            queryset = queryset.filter(name__icontains=name)

        return queryset
    
class CandidateInfoView(ListAPIView):
    permission_classes = [IsSupervisor]
    queryset = models.Candidate.objects.filter(is_active=True, is_free = True)
    model = models.Candidate
    serializer_class = CandidateSerializer
    
    def get_queryset(self):
        """
        Переопределение метода для обработки параметров фильтрации.
        """
        queryset = super().get_queryset()

        # Получение параметров запроса
        by_new = self.request.query_params.get('by_new')
        age = self.request.query_params.get('age')
        age_min = self.request.query_params.get('age_min')
        age_max = self.request.query_params.get('age_max')
        courses = self.request.query_params.get('courses')



        if age:
            queryset = queryset.filter(age=age)
            
        if age_min and age_max:
            queryset = queryset.filter(age__gte=age_min, age__lte=age_max)
            


        if courses:
            course_list = courses.split(',')
            for course in course_list:
                if course == "course_rieltor_join":
                    queryset = queryset.filter(course_rieltor_join="completed")
                elif course == "basic_legal_course":
                    queryset = queryset.filter(basic_legal_course="completed")
                elif course == "course_mortgage":
                    queryset = queryset.filter(course_mortgage="completed")
                elif course == "course_taxation":
                    queryset = queryset.filter(course_taxation="completed")

        # Сортировка по дате создания
        if by_new:
            if by_new.lower() == 'true':
                queryset = queryset.order_by('-created_at')  
            elif by_new.lower() == 'false':
                queryset = queryset.order_by('created_at')  

        return queryset


class MonthlyStatisticView(APIView):
    permission_classes = [IsSupervisor]

    def get(self,request,*args,**kwargs):
        user =request.user
        supervisor = models.Supervisor.objects.get(user=user)
        try:
            office = supervisor.office
        except Exception as e:
            return Response({
                "detail": "Пользователь не отнсится к офису!"
            }, status= status.HTTP_400_BAD_REQUEST)

        year = request.query_params.get('year', datetime.now().year)

        statistics  = []

        for month in range(1, 13):  
            transactions = models.Transaction.objects.filter(
                office=office,
                created_at__year=year,
                created_at__month=month,  
        )

            invitations = models.Invitation.objects.filter(
                office=office,
                created_at__year =year,
                created_at__month =month,
        )

            issued = transactions.filter(operation='add').count()
            invited = invitations.filter(status='invited').count()
            employed = invitations.filter(status='accepted').count()
            rejected = invitations.filter(status='rejected').count()
            subtracted  = transactions.filter(operation = 'subtract').count()

            statistics.append({
                'month': month,
                'issued':issued,
                'invited': invited,
                "employed": employed,
                'rejected': rejected,
                "subtracted": subtracted,

            })
        return Response(statistics,status= status.HTTP_200_OK)