from datetime import datetime
from rest_framework import serializers
from drf_spectacular.utils import extend_schema_field

from .models import Favorite, QuotaRequest, Supervisor, Todo, Candidate, Invitation,Office, CustomUser, Course


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ('id', 'name')
        
class InfoAboutSupervisor(serializers.ModelSerializer):
    role = serializers.CharField(default="2", read_only=True)
    full_name = serializers.SerializerMethodField()
    email = serializers.EmailField(source='user.email', read_only=True)
    phone = serializers.CharField(source='user.phone', read_only=True)  
    photo = serializers.ImageField(source='user.photo', read_only=True)
    
    office_name = serializers.CharField(source='office.name', read_only=True)
    office_location = serializers.CharField(source='office.location', read_only=True)
    office_quota = serializers.CharField(source='office.quota', read_only=True)
    office_used_quota = serializers.CharField(source='office.used_quota', read_only=True)
    
    month = serializers.SerializerMethodField(read_only = True)

    class Meta:
        model = Supervisor
        fields = [
            'role',
            'full_name',    
            'email',        
            'phone', 
            'photo',       
            'office_name', 
            'office_location',  
            'department',   
            'office_quota',
            'office_used_quota', 
            'month',
        ]

    @extend_schema_field(serializers.CharField)
    def get_full_name(self, obj):
        parts = [obj.user.first_name, obj.user.last_name, obj.user.patronymic]  
        return " ".join(filter(None, parts)) 
    
    @extend_schema_field(serializers.CharField)
    def get_month(self, obj):
        MONTHS_RU = {
            1: "Январь",
            2: "Февраль",
            3: "Март",
            4: "Апрель",
            5: "Май",
            6: "Июнь",
            7: "Июль",
            8: "Август",
            9: "Сентябрь",
            10: "Октябрь",
            11: "Ноябрь",
            12: "Декабрь",
        }
        return str(MONTHS_RU[datetime.now().month])
    
class InfoAboutAdmin(serializers.ModelSerializer):
    role = serializers.CharField(default="1", read_only=True)
    full_name = serializers.SerializerMethodField()
    photo = serializers.SerializerMethodField()
    
    email = serializers.EmailField(source='user.email', read_only=True)
    phone = serializers.CharField(source='user.phone', read_only=True)  

    class Meta:
        model = Supervisor
        fields = [
            'role',
            'full_name', 
            'photo',  
            'email',       
            'phone',      
        ]

    @extend_schema_field(serializers.CharField)
    def get_full_name(self, obj):
        parts = [obj.user.first_name, obj.user.last_name, obj.user.patronymic]  # Собираем ФИО
        return " ".join(filter(None, parts))  # Убираем None и соединяем
    
    @extend_schema_field(serializers.CharField)
    def get_photo(self, obj):
        request = self.context.get('request')
        if obj.user.photo and request:
            return request.build_absolute_uri(obj.user.photo.url)
        return None


class TodoSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)  

    class Meta:
        model = Todo
        fields = ['id', "user",'task','due_date','is_complete','is_deleted','created_at']
        read_only_fields = ['user']


class InvitationSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    surname = serializers.SerializerMethodField()
    patronymic = serializers.SerializerMethodField()
    city = serializers.SerializerMethodField()
    age = serializers.SerializerMethodField()
    photo = serializers.SerializerMethodField(read_only=True)
    status = serializers.CharField(read_only=True) 
    updated_at = serializers.CharField(read_only=True)

    class Meta:
        model = Invitation
        fields = [
            'candidate',  
            'name',
            'surname',
            'patronymic',
            'city',
            'age',
            'photo',
            'status',
            'updated_at',
        ]

    @extend_schema_field(serializers.CharField)
    def get_name(self, obj):
        return obj.candidate.name

    @extend_schema_field(serializers.CharField)
    def get_surname(self, obj):
        return obj.candidate.surname

    @extend_schema_field(serializers.CharField)
    def get_patronymic(self, obj):
        return obj.candidate.patronymic

    @extend_schema_field(serializers.CharField)
    def get_city(self, obj):
        return obj.candidate.city

    @extend_schema_field(serializers.IntegerField)
    def get_age(self, obj):
        return obj.candidate.calculate_age()
    
    @extend_schema_field(serializers.CharField)
    def get_photo(self, obj):
        request = self.context.get('request')  
        candidate = obj.candidate
        if candidate.photo and candidate.photo.name:
            return request.build_absolute_uri(candidate.photo.url) 
        return None
        
class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)  
    photo = serializers.ImageField(required=False, allow_null=True)
    full_name = serializers.SerializerMethodField(read_only = True)

    class Meta:
        model = CustomUser
        fields = ['username', 'password', 'email', 'first_name', 'last_name', 'patronymic', 'phone','photo', 'full_name']
        
    @extend_schema_field(serializers.CharField)
    def get_full_name(self, obj):
        parts = [obj.first_name, obj.last_name, obj.patronymic]  
        return " ".join(filter(None, parts))  


class SupervisorSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    office_name = serializers.SerializerMethodField(read_only = True)
    
    class Meta:
        model = Supervisor
        fields = ['id', 'user', 'office','office_name', 'department']
        
    @extend_schema_field(serializers.CharField)
    def get_office_name(self, obj):
        if obj.office:
            return obj.office.name
        else:
            return None

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = CustomUser.objects.create_user(**user_data)
        supervisor = Supervisor.objects.create(user=user, **validated_data)
        return supervisor

    def update(self, instance, validated_data):
        # Извлекаем вложенные данные для пользователя
        user_data = validated_data.pop('user', None)

        # Обновляем данные Supervisor
        instance.office = validated_data.get('office', instance.office)
        instance.department = validated_data.get('department', instance.department)
        instance.save()

        # Если переданы данные пользователя, обновляем их
        if user_data:
            user = instance.user
            for attr, value in user_data.items():
                if attr == 'password':  # Особая обработка для пароля
                    user.set_password(value)
                else:
                    setattr(user, attr, value)
            user.save()

        return instance
        
        
class CandidateSerializer(serializers.ModelSerializer):
    age = serializers.SerializerMethodField()
    office_name = serializers.SerializerMethodField()
    courses = CourseSerializer(many=True, read_only=True)
    courses_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Course.objects.all(),
        write_only=True,
        source='courses',
        required=False,
    )
    birth = serializers.DateField(format='%d.%m.%Y')
    
    class Meta:
        model = Candidate
        fields = "__all__"
        
    def create(self, validated_data):
        courses_data = validated_data.pop('courses', None)  
        candidate = Candidate.objects.create(**validated_data)
        if courses_data is not None:
            candidate.courses.set(courses_data)
        return candidate

    
    @extend_schema_field(serializers.IntegerField)
    def get_age(self, obj):
        """Вычисление возраста кандидата на основе его даты рождения."""
        if obj.birth:
            return obj.calculate_age()
    
    @extend_schema_field(serializers.CharField)
    def get_office_name(self, obj):
        if obj.is_free:
            return None
        else:
            office = obj.office
            return office.name
            
    
    def validate(self, data):
        """Обработка логики в save методе"""
        is_free = data.get('is_free', None)
        office = data.get('office', None)

        if not is_free and office is None:
            raise serializers.ValidationError("Если кандидат не свободен, поле 'офис' обязательно.")
        
        return data
    
    
class CandidateInfoSerializer(serializers.ModelSerializer):
    courses = CourseSerializer(many=True, read_only=True)
    age = serializers.SerializerMethodField()
    is_favorite = serializers.SerializerMethodField()
    favorite_id = serializers.SerializerMethodField()
    is_invited = serializers.SerializerMethodField()
    birth = serializers.DateField(format='%d.%m.%Y')
    
    class Meta:
        model = Candidate
        fields = [
            'id',
            'name',
            'surname',
            'patronymic',
            'birth',
            'age',
            'education',
            'photo',
            'country',
            'city',
            'resume',
            'candidate_achievements',
            'courses',
            'updated_at',
            'is_favorite',
            'favorite_id',
            'is_invited',
            'achivment_objects',
            'achivment_clients',
            'achivment_leads',
            'achivment_exclusives',
            'achivment_deals',
        ]
        
    @extend_schema_field(serializers.IntegerField)
    def get_age(self, obj):
        """Вычисление возраста кандидата на основе его даты рождения."""
        if obj.birth:
            return obj.calculate_age()
    
    @extend_schema_field(serializers.BooleanField)
    def get_is_favorite(self, obj):
        user = self.context['request'].user
        return Favorite.objects.filter(user=user, candidate=obj).exists()

    @extend_schema_field(serializers.IntegerField)
    def get_favorite_id(self, obj):
        """
        Возвращает ID записи избранного, если кандидат находится в избранном.
        """
        user = self.context['request'].user
        favorite = Favorite.objects.filter(user=user, candidate=obj).first()
        return favorite.id if favorite else None
    
    @extend_schema_field(serializers.BooleanField)
    def get_is_invited(self, obj):
        user = self.context['request'].user
        return Invitation.objects.filter(candidate=obj, office__supervisor__user=user, status='invited').exists()

class MonthlyStatisticSerializer(serializers.Serializer):
    month = serializers.CharField()
    issued = serializers.IntegerField()
    invited = serializers.IntegerField()
    accepted = serializers.IntegerField()
    rejected = serializers.IntegerField()
    subtracted = serializers.IntegerField()
    
    
class OfficeSerializer(serializers.ModelSerializer):

    class Meta :
        model = Office
        fields = "__all__"


class FavoriteSerializer(serializers.ModelSerializer):
    candidate_info = CandidateInfoSerializer(source = 'candidate', read_only=True)
    
    class Meta:
        model = Favorite
        fields = [
                    'id',
                    'candidate', 
                    'candidate_info',
                    'created_at',
                  ]  
        read_only_fields = ['created_at', 'candidate_info']


class InvitationStatisticsSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    photo = serializers.SerializerMethodField()
    city = serializers.SerializerMethodField()
    age = serializers.SerializerMethodField()
    
    class Meta:
        model = Invitation
        fields = [
            'full_name',
            'photo',
            'age',
            'city',
            'status',
            'updated_at',
        ]
        
    @extend_schema_field(serializers.CharField)
    def get_full_name(self, obj):
        candidate = obj.candidate
        parts = [candidate.name, candidate.surname, candidate.patronymic] 
        return " ".join(filter(None, parts))  

    
    @extend_schema_field(serializers.CharField)
    def get_photo(self, obj):
        request = self.context.get('request')  
        candidate = obj.candidate
        if candidate.photo and candidate.photo.name:
            return request.build_absolute_uri(candidate.photo.url) 
        return None
    
    @extend_schema_field(serializers.CharField)
    def get_city(self, obj):
        candidate = obj.candidate
        return candidate.city
    
    @extend_schema_field(serializers.IntegerField)
    def get_age(self, obj):
        return obj.candidate.calculate_age()


class AdminInvitationSerializer(serializers.ModelSerializer):
    supervisor = serializers.SerializerMethodField()
    office_name = serializers.SerializerMethodField()
    class Meta:
        model = Invitation
        fields = ['id', 'status', 'created_at','office_name' ,'supervisor', 'office'] 
    
    @extend_schema_field(serializers.CharField)
    def get_supervisor(self, obj):
        office = obj.office
        try:
            supervisor = Supervisor.objects.filter(office=office).first()
            if supervisor is None:
                return None
            try:
                user = supervisor.user
            except CustomUser.DoesNotExist:
                return None
            parts = [user.first_name, user.last_name, user.patronymic]  
            return " ".join(filter(None, parts))  

        except Supervisor.DoesNotExist:
            return "Not Exist"
    
    @extend_schema_field(serializers.CharField)
    def get_office_name(self, obj):
        return obj.office.name
    
class ArchiveCandidateSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    bio = serializers.SerializerMethodField()
    city = serializers.SerializerMethodField()
    cause = serializers.SerializerMethodField()
    
    class Meta:
        model = Candidate
        fields = [
                'id',
                'full_name',
                'updated_at',
                'bio',
                'photo',
                'city',
                'phone',
                'email',
                'cause'
            ]
    
    @extend_schema_field(serializers.CharField)
    def get_bio(self, obj):
        return f'{obj.surname} {obj.name}'
        
    @extend_schema_field(serializers.CharField)
    def get_city(self,obj):
        if obj.city:
            return obj.city
        return ''
    
    @extend_schema_field(serializers.CharField)
    def get_cause(self,obj):
        if obj.office:
            office = obj.office
            return office.name
        return 'не прошёл собеседование'
    
    @extend_schema_field(serializers.CharField)
    def get_full_name(self, obj):
        parts = [obj.name, obj.surname, obj.patronymic]  
        return " ".join(filter(None, parts))  

class QuotaRequestSerializer(serializers.ModelSerializer):
    office_name = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = QuotaRequest
        fields = ['id',
                  'office',
                  'office_name',
                  'amount',
                  'status',
                  'created_at',
                  'updated_at',
                  ]
        
        read_only_fields = ['id', 'created_at', 'updated_at', 'office']
    
    
    @extend_schema_field(serializers.CharField)
    def get_office_name(self, obj):
        return obj.office.name
    
class QuotaRequestHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = QuotaRequest
        fields = ['id', 'amount', 'status', 'created_at']  
        
class QuotaRequestDetailSerializer(serializers.ModelSerializer):
    office_info = OfficeSerializer(source='office', read_only=True)
    history = serializers.SerializerMethodField()
    
    class Meta:
        model = QuotaRequest
        fields = ['id', 'amount','created_at','status','office_info', 'history']
        
    def get_history(self, obj):
        office = obj.office
        requests = QuotaRequest.objects.filter(office=office).order_by('-created_at')[1:6]
        return QuotaRequestHistorySerializer(requests, many=True).data
