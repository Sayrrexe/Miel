from django.utils import timezone

from django.db.models.functions import TruncDay
from django.db.models import Count
from django.db.models import Q

from rest_framework import status

from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from datetime import datetime
from dateutil.relativedelta import relativedelta

from . import models
from . import serializers

from .permissions import IsAdministrator, IsSupervisor
from .utils import (restore_archived_candidates, 
                    update_all_candidate_statuses, 
                    update_one_status, write_off_the_quota)

from drf_spectacular.utils import extend_schema,extend_schema_view, OpenApiResponse, OpenApiExample, OpenApiParameter
from drf_spectacular.types import OpenApiTypes


@extend_schema(
    summary="Получение полной информации о пользователе",
    description=(
        "Возвращает информацию о пользователе в зависимости от его роли. "
        "Если пользователь администратор, возвращаются данные об администраторе. "
        "Если супервайзер, возвращаются данные о супервайзере. "
        "Иначе ошибка."
    ),
    responses={
        200: OpenApiResponse(
            response={
                "admin": {
                    "role": "int",
                    "full_name": "str",
                    "photo": "str (nullable)",
                    "email": "str",
                    "phone": "str"
                },
                "supervisor": {
                    "role": "int",
                    "full_name": "str",
                    "email": "str",
                    "phone": "str",
                    "photo": "str (nullable)",
                    "office_name": "str",
                    "office_location": "str",
                    "department": "str",
                    "office_quota": "int",
                    "office_used_quota": "int"
                }
            },
            description="Успешное получение данных о пользователе"
        ),
        400: OpenApiResponse(
            response={"error": "str"},
            description="Пользователь не является членом команды"
        ),
    },
    examples=[
        OpenApiExample(
            "Ответ для администратора",
            value={
                "role": 1,
                "full_name": "Admin User",
                "photo": None,
                "email": "admin@example.com",
                "phone": "+123456789"
            },
            response_only=True,
            status_codes=["200"],
        ),
        OpenApiExample(
            "Ответ для супервайзера",
            value={
                "role": 2,
                "full_name": "Supervisor User",
                "email": "supervisor@example.com",
                "phone": "+987654321",
                "photo": "https://example.com/photo.jpg",
                "office_name": "Main Office",
                "office_location": "123 Main St.",
                "department": "Real Estate",
                "office_quota": 15,
                "office_used_quota": 7
            },
            response_only=True,
            status_codes=["200"],
        ),
        OpenApiExample(
            "Ответ с ошибкой",
            value={"error": "The user is not a member of staff."},
            response_only=True,
            status_codes=["400"],
        ),
    ],
)
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
    queryset = models.Todo.objects.all().order_by('-due_date')
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
    
    @extend_schema(
        summary="Получение списка приглашённых кандидатов",
        description="Возвращает список приглашённых рук-лем кандидатов, с потдержкой фильтрации и отправкой новых приглашений",
        parameters=[
            OpenApiParameter(
                name="status",
                type=str,
                location=OpenApiParameter.QUERY,
                description="Фильтр по статусу приглашений (invited, accepted, rejected)."
            ),
            OpenApiParameter(
                name="start_date",
                type=str,
                location=OpenApiParameter.QUERY,
                description="Фильтр по дате: начало диапазона (формат 'YYYY-MM-DD')."
            ),
            OpenApiParameter(
                name="end_date",
                type=str,
                location=OpenApiParameter.QUERY,
                description="Фильтр по дате: конец диапазона (формат 'YYYY-MM-DD')."
            ),
        ],
        responses={
            200: OpenApiResponse(
                response=serializers.InvitationSerializer(many=True),
                description="Список приглашений успешно получен."
            ),
            400: OpenApiResponse(
                response={"error": "str"},
                description="Ошибка в запросе или отсутствует супервизор."
            ),
        },
    )
    def get(self, request):
        supervisor = models.Supervisor.objects.filter(user=request.user).first()
        if not supervisor:
            return Response({'error': 'Supervisor not found'}, status=status.HTTP_400_BAD_REQUEST)
    
        office = supervisor.office
        queryset = models.Invitation.objects.filter(office=office).all().order_by('-id')
        
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
    
    @extend_schema(
        summary="Создать новое приглашение",
        description="Создает новое приглашение для кандидата, проверяя наличие квоты у офиса.",
        request=serializers.InvitationSerializer,
        responses={
            201: OpenApiResponse(
                response=serializers.InvitationSerializer,
                description="Приглашение успешно создано."
            ),
            400: OpenApiResponse(
                response={"error": "str"},
                description="Ошибка в запросе (например, кандидат уже приглашён или неверные данные)."
            ),
        },
    )
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
    
@extend_schema_view(
    list=extend_schema(
        summary="Получить список избранного",
        description="Возвращает список избранных объектов пользователя.",
        responses={
            200: OpenApiResponse(
                response=serializers.FavoriteSerializer(many=True),
                description="Список избранных объектов успешно получен."
            ),
        },
    ),
    create=extend_schema(
        summary="Добавить в избранное",
        description="Добавляет новый объект в избранное для текущего пользователя.",
        request=serializers.FavoriteSerializer,
        responses={
            201: OpenApiResponse(
                response=serializers.FavoriteSerializer,
                description="Объект успешно добавлен в избранное."
            ),
        },
    ),
    retrieve=extend_schema(
        summary="Получить избранный объект",
        description="Возвращает подробную информацию об объекте в избранном.",
        responses={
            200: OpenApiResponse(
                response=serializers.FavoriteSerializer,
                description="Объект успешно получен."
            ),
            404: OpenApiResponse(
                response={"error": "str"},
                description="Объект не найден."
            ),
        },
    ),
    update=extend_schema(
        summary="Обновить избранный объект",
        description="Обновляет данные избранного объекта.",
        request=serializers.FavoriteSerializer,
        responses={
            200: OpenApiResponse(
                response=serializers.FavoriteSerializer,
                description="Объект успешно обновлён."
            ),
        },
    ),
    destroy=extend_schema(
        summary="Удалить из избранного",
        description="Удаляет объект из избранного пользователя.",
        responses={
            204: OpenApiResponse(
                description="Объект успешно удалён."
            ),
        },
    ),
) 
class FavoriteViewSet(ModelViewSet):
    serializer_class = serializers.FavoriteSerializer
    permission_classes = [IsSupervisor]

    def get_queryset(self):
        return models.Favorite.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        
@extend_schema(
    summary="Получить статистику TODO",
    description=(
        "Возвращает статистику задач пользователя: общее количество созданных, завершённых, "
        "удалённых задач, а также дни недели с максимальной активностью."
    ),
    parameters=[
        OpenApiParameter(
            name="start_date",
            type=OpenApiTypes.DATE,
            location=OpenApiParameter.QUERY,
            description="Фильтр задач по начальной дате создания (формат 'YYYY-MM-DD')."
        ),
        OpenApiParameter(
            name="end_date",
            type=OpenApiTypes.DATE,
            location=OpenApiParameter.QUERY,
            description="Фильтр задач по конечной дате создания (формат 'YYYY-MM-DD')."
        ),
    ],
    responses={
        200: OpenApiResponse(
            response=OpenApiTypes.OBJECT,
            description="Успешный ответ со статистикой задач",
            examples=[
                OpenApiExample(
                    "Пример",
                    value={
                        "total_created": 25,
                        "total_completed": 15,
                        "total_deleted": 5,
                        "max_created_day": "Monday",
                        "max_completed_day": "Wednesday",
                    },
                    response_only=True,
                )
            ],
        ),
        400: OpenApiResponse(
            response={"error": "str"},
            description="Ошибка в запросе (например, неверный формат даты)."
        ),
    },
)      
class TodoStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        try:
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
                todos_filter = todos_filter.filter(created_at__gte=start_date)
            if end_date:
                todos_filter = todos_filter.filter(created_at__lte=end_date)
            
                

            # 1. Всего создано
            total_created = todos_filter.count()

            # 2. Завершено
            total_completed = todos_filter.filter(is_complete=True).count()

            # 3. Удалено
            total_deleted = todos_filter.filter(is_deleted=True).count()

            # 4. День недели с максимальными созданиями
            max_created_day = (
                todos_filter.annotate(day=TruncDay('created_at'))
                .values('day')
                .annotate(count=Count('id'))
                .order_by('-count')
                .first()
            )

            # 5. День недели с максимальными завершениями
            completed_by_day = (
                todos_filter.filter(is_complete=True)
                .annotate(day=TruncDay('complete_at'))
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
        except Exception as except_text:
            return Response({"error": except_text}, status=status.HTTP_400_BAD_REQUEST)
    
@extend_schema(
    summary="Список супервайзеров",
    description="Возвращает список супервайзеров, с возможностью фильтрации по имени, фамилии и отчеству.",
    parameters=[
        OpenApiParameter(
            name="search",
            type=str,
            location=OpenApiParameter.QUERY,
            description="Поиск по имени, фамилии или отчество пользователя."
        )
    ],
    responses={200: serializers.SupervisorSerializer(many=True)}
)   
class SupervisorViewSet(ModelViewSet):
    permission_classes = [IsAdministrator]
    queryset = models.Supervisor.objects.select_related('user', 'office').all().order_by('-id')
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

@extend_schema(
    summary="Список кандидатов",
    description="Возвращает список кандидатов с возможностью фильтрации по состоянию и имени.",
    parameters=[
        OpenApiParameter(
            name="is_free",
            type=str,
            location=OpenApiParameter.QUERY,
            description="Фильтрация кандидатов по состоянию: свободен (true/false)."
        ),
        OpenApiParameter(
            name="search",
            type=str,
            location=OpenApiParameter.QUERY,
            description="Поиск кандидатов по имени (регистронезависимый)."
        )
    ],
    responses={200: serializers.CandidateSerializer(many=True)}
)
class CandidateViewSet(ModelViewSet):
    permission_classes = [IsAdministrator]
    queryset = models.Candidate.objects.all().filter(is_archive = False).order_by('-id')
    serializer_class = serializers.CandidateSerializer

    def get_queryset(self):
        """
        Переопределение метода для ручной обработки параметров фильтрации.
        """
        queryset = super().get_queryset()
        is_free = self.request.query_params.get('is_free')
        search = self.request.query_params.get('search')

        if is_free is not None:
            # Фильтрация по "свободен?"
            if is_free.lower() == 'true':
                queryset = queryset.filter(is_free=True)
            elif is_free.lower() == 'false':
                queryset = queryset.filter(is_free=False)
            else:
                pass

        if search:
            # Поиск по имени (регистронезависимый)
            search = search.lower()
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(surname__icontains=search) |
                Q(patronymic__icontains=search)
            )

        return queryset
    
@extend_schema(
    summary="Получение информации о кандидатах",
    description="Возвращает список доступных кандидатов с фильтрацией по возрасту, курсам и дате создания.",
    parameters=[
        OpenApiParameter(
            name="by_new",
            type=str,
            location=OpenApiParameter.QUERY,
            description="Сортировка по дате создания. Значения: true (по убыванию), false (по возрастанию)."
        ),
        OpenApiParameter(
            name="age",
            type=int,
            location=OpenApiParameter.QUERY,
            description="Фильтрация по точному возрасту кандидата."
        ),
        OpenApiParameter(
            name="age_min",
            type=int,
            location=OpenApiParameter.QUERY,
            description="Минимальный возраст для фильтрации кандидатов."
        ),
        OpenApiParameter(
            name="age_max",
            type=int,
            location=OpenApiParameter.QUERY,
            description="Максимальный возраст для фильтрации кандидатов."
        ),
        OpenApiParameter(
            name="courses",
            type=str,
            location=OpenApiParameter.QUERY,
            description=(
                "Фильтрация по пройденным курсам. "
                "Укажите через запятую. Возможные значения: "
                "`course_rieltor_join` (курс риэлторов), "
                "`basic_legal_course` (базовый юридический курс), "
                "`course_mortgage` (курс ипотечного кредитования), "
                "`course_taxation` (курс по налогообложению)."
            )
        )
    ],
    responses={200: serializers.CandidateInfoSerializer(many=True)},
)
class CandidateInfoView(ListAPIView):
    permission_classes = [IsSupervisor]
    queryset = models.Candidate.objects.filter(is_archive=False, is_free = True).order_by('-id')
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

@extend_schema(
    summary="Статистика по месяцам",
    description=(
        "Возвращает статистику по месяцам за указанный год или последние 10 месяцев по умолчанию. "
        "Для фильтрации можно передать параметр `year` (например, ?year=2024)."
    ),
    parameters=[
        OpenApiParameter(
            name="year",
            type=int,
            location=OpenApiParameter.QUERY,
            description="Год для фильтрации статистики (например, 2024)."
        )
    ],
    responses={200: serializers.MonthlyStatisticSerializer(many=True)},
)
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

@extend_schema(
        summary="Получить список офисов",
        description=(
            "Возвращает список офисов с возможностью фильтрации по имени. "
            "Используйте параметр `search` для поиска."
        ),
        parameters=[
            OpenApiParameter(
                name="search",
                type=str,
                location=OpenApiParameter.QUERY,
                description="Фильтр по названию офиса (регистронезависимый поиск)."
            )
        ],
)
class OfficeViewSet(ModelViewSet):
    permission_classes = [IsAdministrator]
    queryset = models.Office.objects.all().order_by('-id')
    serializer_class = serializers.OfficeSerializer

    def get_queryset(self):
        """
        Переопределение метода для ручной обработки параметров фильтрации.
        """
        queryset = super().get_queryset()
        search_query = self.request.query_params.get('search')

        if search_query:
            queryset = queryset.filter(name__icontains=search_query.strip())

        return queryset
    
@extend_schema(
        summary="Статистика приглашений",
        description=(
            "Позволяет получить статистику по приглашениям с фильтрацией по диапазону дат."
        ),
        parameters=[
            OpenApiParameter(
                name="start_date",
                type=str,
                location=OpenApiParameter.QUERY,
                description="Начальная дата в формате YYYY-MM-DDTHH:MM:SSZ."
            ),
            OpenApiParameter(
                name="end_date",
                type=str,
                location=OpenApiParameter.QUERY,
                description="Конечная дата в формате YYYY-MM-DDTHH:MM:SSZ."
            ),
        ],
    )    
class InvitationStatisticsViewSet(ListAPIView):
    permission_classes = [IsAdministrator]
    queryset = models.Invitation.objects.filter().order_by('-id')
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
            
        return Response({"detail": f"Неподдерживаемый статус: {status_value}"}, status=status.HTTP_400_BAD_REQUEST)
            
            
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
    queryset = models.Candidate.objects.filter(is_archive=True).order_by('updated_at')
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
