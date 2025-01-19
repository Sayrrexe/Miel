from django.shortcuts import redirect
from django.db.models.functions import TruncDay
from django.utils import timezone
from django.db.models import Count
from django.db.models import Q

from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from datetime import datetime
from dateutil.relativedelta import relativedelta

from . import models
from . import serializers

from .permissions import IsAdministrator, IsSupervisor
from .utils import (restore_archived_candidates, 
                    update_all_candidate_statuses, 
                    update_one_status, write_off_the_quota)


def index(request):
    return redirect('/admin/')

class GetUserInfoView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            # Проверяем, является ли пользователь админа
            queryset = models.Administrator.objects.filter(user=request.user)
            if queryset.exists():
                serializer = serializers.InfoAboutAdmin(queryset, many=True, context={'request': request})
                return Response(serializer.data)
        except models.Administrator.DoesNotExist:
            pass  
        
        
        try:
            # Проверяем, является ли пользователь Supervisor
            queryset = models.Supervisor.objects.filter(user=request.user)
            if queryset.exists():
                serializer = serializers.InfoAboutSupervisor(queryset, many=True, context={'request': request})
                return Response(serializer.data)
        except models.Supervisor.DoesNotExist:
            pass  


        return Response({'error': 'The user is not a member of staff.'}, status=status.HTTP_400_BAD_REQUEST)

class TodoViewSet(ModelViewSet):
    queryset = models.Todo.objects.all()
    serializer_class = serializers.TodoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Переопределяем метод для фильтрации задач по текущему пользователю.
        """
        return models.Todo.objects.filter(user=self.request.user, is_visible=True)

    def perform_create(self, serializer):
        """
        Устанавливаем текущего пользователя как владельца задачи.
        """
        serializer.save(user=self.request.user)

class InvitationAPIView(APIView):
    permission_classes = [IsSupervisor]
    serializer_class = serializers.InvitationSerializer
    model = models.Invitation
    
    def get(self, request):
        supervisor = models.Supervisor.objects.filter(user=request.user).first()
        if not supervisor:
            return Response({'error': 'Supervisor not found'}, status=status.HTTP_400_BAD_REQUEST)
    
        office = supervisor.office
        queryset = models.Invitation.objects.filter(office=office).all()
        
        # Фильтрация
        status = request.query_params.get('status')
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        
        if status:
            queryset = queryset.filter(status=status)
        if start_date and end_date:
            queryset = queryset.filter(updated_at__range=[start_date, end_date])
        elif start_date:
            queryset = queryset.filter(updated_at__gte=start_date)
        elif end_date:
            queryset = queryset.filter(updated_at__lte=end_date)
        
        serializer = serializers.InvitationSerializer(queryset, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        supervisor = models.Supervisor.objects.filter(user=self.request.user).first()
        if not supervisor:
            return Response({'error': 'Supervisor not found'}, status=status.HTTP_400_BAD_REQUEST)
        
        
        office = supervisor.office
        if office == None:
            return Response({'error': 'Office not found'}, status=status.HTTP_400_BAD_REQUEST)

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
        
        serializer = serializers.InvitationSerializer(data=request.data)
        
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
    serializer_class = serializers.FavoriteSerializer
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
    permission_classes = [IsAdministrator]
    queryset = models.Supervisor.objects.select_related('user', 'office').all()
    serializer_class = serializers.SupervisorSerializer
    
    def get_queryset(self):
        """
        Переопределение метода для ручной обработки параметров фильтрации.
        """
        queryset = super().get_queryset()
        search = self.request.query_params.get('search')

        if search:
            search = search.lower()
            queryset = queryset.filter(
                Q(user__first_name__icontains=search) |
                Q(user__last_name__icontains=search) |
                Q(user__patronymic__icontains=search)
            )

        return queryset

    def perform_create(self, serializer):
        """
        Переопределение для обработки вложенных данных пользователя.
        """
        serializer.save()

    def perform_update(self, serializer):
        """
        Обновление данных Supervisor, включая вложенные данные пользователя.
        """
        supervisor = self.get_object()
        user_data = self.request.data.get('user', None)

        if user_data:
            # Обновляем данные пользователя
            for key, value in user_data.items():
                setattr(supervisor.user, key, value)
            supervisor.user.save()

        serializer.save()

    def perform_destroy(self, instance):
        instance.user.is_active = False  
        instance.user.save()
        instance.delete()


class CandidateViewSet(ModelViewSet):
    permission_classes = [IsAdministrator]
    queryset = models.Candidate.objects.all()
    serializer_class = serializers.CandidateSerializer

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
    queryset = models.Candidate.objects.filter(is_archive=False, is_free = True)
    model = models.Candidate
    serializer_class = serializers.CandidateInfoSerializer
    
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
            year = datetime.now().year - int(age)
            queryset = queryset.filter(birth__year=year)
            
        if age_min and age_max:
            year_min = datetime.now().year - int(age_min)
            year_max = datetime.now().year - int(age_max)
            queryset = queryset.filter(birth__year__lte=year_min, birth__year__gte=year_max)
        elif age_min:
            year_min = datetime.now().year - int(age_min)
            queryset = queryset.filter(birth__year__lte=year_min)
        elif age_max:
            year_max = datetime.now().year - int(age_max)
            queryset = queryset.filter(birth__year__gte=year_max)
            
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

    def get_serializer_context(self):
        """
        Передаём текущий запрос в контекст сериализатора.
        """
        context = super().get_serializer_context()
        context.update({'request': self.request})
        return context


class MonthlyStatisticView(APIView):
    permission_classes = [IsSupervisor]

    def get(self, request, *args, **kwargs):
        user = request.user
        supervisor = models.Supervisor.objects.get(user=user)
        try:
            office = supervisor.office
        except models.Supervisor.DoesNotExist:
            return Response({"detail": "Пользователь не относится к офису!"}, status=status.HTTP_400_BAD_REQUEST)
        # Фильтрация по году или последние 10 месяцев по умолчанию
        year = request.query_params.get('year')
        if year:
            try:
                start_date = datetime.strptime(f"{year}-01-01", "%Y-%m-%d")
                end_date = datetime.strptime(f"{year}-12-31", "%Y-%m-%d")
            except ValueError:
                return Response({"detail": "Некорректный формат года!"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            end_date = datetime.now()
            start_date = end_date - relativedelta(months=9)

        statistics = []
        # Генерация статистики по месяцам
        current_date = start_date
        while current_date <= end_date:
            transactions = models.Transaction.objects.filter(
                office=office,
                created_at__year=current_date.year,
                created_at__month=current_date.month,
            )

            invitations = models.Invitation.objects.filter(
                office=office,
                created_at__year=current_date.year,
                created_at__month=current_date.month,
            )

            statistics.append({
                'month': current_date.strftime('%B %Y'),
                'issued': transactions.filter(operation='add').count(),
                'invited': invitations.filter(status='invited').count(),
                "accepted": invitations.filter(status='accepted').count(),
                'rejected': invitations.filter(status='rejected').count(),
                "subtracted": transactions.filter(operation='subtract').count(),
            })

            current_date += relativedelta(months=1)

        serializer = serializers.MonthlyStatisticSerializer(statistics, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class OfficeViewSet(ModelViewSet):
    permission_classes = [IsAdministrator]
    queryset = models.Office.objects.all()
    serializer_class = serializers.OfficeSerializer

    def get_queryset(self):
        """
        Переопределение метода для ручной обработки параметров фильтрации.
        """
        queryset = super().get_queryset()
        name = self.request.query_params.get('search')

        if name:
            queryset = queryset.filter(name__icontains=name)

        return queryset
    
    
class InvitationStatisticsViewSet(ListAPIView):
    permission_classes = [IsAdministrator]
    queryset = models.Invitation.objects.filter()
    model = models.Invitation
    serializer_class = serializers.InvitationStatisticsSerializer
    
    def get_queryset(self):
        """
        Переопределение метода для обработки параметров фильтрации.
        """
        queryset = super().get_queryset()

        # Получение параметров запроса
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        
        if start_date and end_date:
            queryset = queryset.filter(updated_at__range=[start_date, end_date])
        elif start_date:
            queryset = queryset.filter(updated_at__gte=start_date)
        elif end_date:
            queryset = queryset.filter(updated_at__lte=end_date)  

        return queryset
    
    
class CandidateInvitationsView(APIView):
    permission_classes = [IsAdministrator] 

    def get(self, request, id, *args, **kwargs):
        try:
            candidate = models.Candidate.objects.get(id=id)
        except models.Candidate.DoesNotExist:
            return Response({"detail": "Кандидат не найден!"}, status=status.HTTP_404_NOT_FOUND)

        invitations = models.Invitation.objects.filter(candidate=candidate)
        serializer = serializers.AdminInvitationSerializer(invitations, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    
class CandidateInvitationUpdateView(APIView):
    permission_classes = [IsAdministrator]  

    def patch(self, request, candidate_id, invitation_id, *args, **kwargs):
        try:
            invitation = models.Invitation.objects.get(id=invitation_id, candidate_id=candidate_id)
        except models.Invitation.DoesNotExist:
            return Response({"detail": "Приглашение не найдено!"}, status=status.HTTP_404_NOT_FOUND)

        # Проверяем наличие статуса в теле запроса
        status_value = request.data.get('status')
        if not status_value:
            return Response({"detail": "Поле 'status' обязательно!"}, status=status.HTTP_400_BAD_REQUEST)

        # Обновляем статус приглашения
        if status_value == 'accepted':
            change_status, message = update_all_candidate_statuses(candidate_id=candidate_id,   invitation_id=invitation_id)

            if change_status:
                return Response({"detail": message}, status=status.HTTP_200_OK)
            else:
                return Response({"detail": message}, status=status.HTTP_400_BAD_REQUEST)
        elif status_value == 'invited' or status_value == 'rejected':
            change_status, message = update_one_status(invitation_id=invitation_id, status=status_value)
            if change_status:
                return Response({"detail": message}, status=status.HTTP_200_OK)
            else:
                return Response({"detail": message}, status=status.HTTP_400_BAD_REQUEST)
            
            
class AdminMonthlyStatisticView(APIView):
    permission_classes = [IsAdministrator]

    def get(self, request, *args, **kwargs):
        year = request.query_params.get('year')
        
        if year:
            try:
                start_date = datetime.strptime(f"{year}-01-01", "%Y-%m-%d")
                end_date = datetime.strptime(f"{year}-12-31", "%Y-%m-%d")
            except ValueError:
                return Response({"detail": "Некорректный формат года!"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            end_date = datetime.now()
            start_date = end_date - relativedelta(months=9)

        statistics = []

        # Генерация статистики по месяцам
        current_date = start_date
        while current_date <= end_date:
            transactions = models.Transaction.objects.filter(
                created_at__year=current_date.year,
                created_at__month=current_date.month,
            )

            invitations = models.Invitation.objects.filter(
                created_at__year=current_date.year,
                created_at__month=current_date.month,
            )

            statistics.append({
                'month': current_date.strftime('%B %Y'),
                'issued': transactions.filter(operation='add').count(),
                "subtracted": transactions.filter(operation='subtract').count(),
                'invited': invitations.filter(status='invited').count(),
                "accepted": invitations.filter(status='accepted').count(),
                'rejected': invitations.filter(status='rejected').count(),
            })

            current_date += relativedelta(months=1)

        serializer = serializers.MonthlyStatisticSerializer(statistics, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
        
        
class ArchiveCandidateInfoView(ListAPIView):
    permission_classes = [IsAdministrator]
    queryset = models.Candidate.objects.filter(is_archive=True)
    model = models.Candidate
    serializer_class = serializers.ArchiveCandidateSerializer
    
    def get_queryset(self):
        """
        Переопределение метода для обработки параметров фильтрации.
        """
        queryset = super().get_queryset()

        # Получение параметров запроса
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        
        if start_date and end_date:
            queryset = queryset.filter(updated_at__range=[start_date, end_date])
        elif start_date:
            queryset = queryset.filter(updated_at__gte=start_date)
        elif end_date:
            queryset = queryset.filter(updated_at__lte=end_date)

        return queryset
    
    
class ArchiveBatchRestoreView(APIView):
    permission_classes = [IsAdministrator]  

    def post(self, request, *args, **kwargs):
        candidate_ids = request.data.get('candidate_ids', '')

        if not candidate_ids or not isinstance(candidate_ids, str):
            return Response({"detail": "Поле 'candidate_ids' обязательно и должно быть строкой с ID через запятую."}, status=status.HTTP_400_BAD_REQUEST)

        candidate_ids_list = [
            int(id.strip()) for id in candidate_ids.split(',') if id.strip().isdigit()
        ]

        if not candidate_ids_list:
            return Response({"detail": "Не переданы корректные ID кандидатов."}, status=status.HTTP_400_BAD_REQUEST)

        operation_status, message = restore_archived_candidates(candidate_ids_list)
        if operation_status:
            return Response({"detail": message}, status=status.HTTP_200_OK)
        else:
            return Response({"detail": message}, status=status.HTTP_400_BAD_REQUEST)
       
        
class LinkInfoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        link = models.ChatLink.objects.filter().first()
        return Response({"link": link.link}, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        try:
            admin = models.Administrator.objects.get(user=request.user)
        except models.Administrator.DoesNotExist:
            return Response({"detail": "Только администраторы могут редактировать."}, status=status.HTTP_403_FORBIDDEN)

        link = request.data.get("link")
        platform = request.data.get("platform")
        if not link or not link.startswith("https"):
            return Response({"detail": "Ссылка должна начинаться с 'https'."}, status=status.HTTP_400_BAD_REQUEST)
        if not platform:
            return Response({"detail": "platform is required"}, status=status.HTTP_400_BAD_REQUEST)
        if platform not in ['telegram', 'whatsapp']:
            return Response({"detail": "platform is invalid ( only 'telegram' or 'whatsapp')"}, status=status.HTTP_400_BAD_REQUEST)

        chat_link = models.ChatLink.objects.create(
        user=request.user,
        platform=platform,  
        link=link
        )

        return Response({"detail": "Ссылка успешно обновлена."}, status=status.HTTP_200_OK)
