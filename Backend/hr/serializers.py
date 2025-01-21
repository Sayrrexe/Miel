from datetime import date
from os import read

from rest_framework import serializers

from .models import Favorite, Supervisor, Todo, Candidate, Invitation,Office, CustomUser

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
        ]

    def get_full_name(self, obj):
        return obj.user.get_full_name()
    
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

    def get_full_name(self, obj):
        return obj.user.get_full_name()
    
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
            'status',
            'updated_at',
        ]

    def get_name(self, obj):
        return obj.candidate.name

    def get_surname(self, obj):
        return obj.candidate.surname

    def get_patronymic(self, obj):
        return obj.candidate.patronymic

    def get_city(self, obj):
        return obj.candidate.city

    def get_age(self, obj):
        return obj.candidate.calculate_age()
    
        
class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)  
    photo = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = CustomUser
        fields = ['username', 'password', 'email', 'first_name', 'last_name', 'patronymic', 'phone','photo']

class SupervisorSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Supervisor
        fields = ['id', 'user', 'office', 'department']

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
    
    class Meta:
        model = Candidate
        fields = '__all__'
        
    def get_age(self, obj):
        """Вычисление возраста кандидата на основе его даты рождения."""
        if obj.birth:
            return obj.calculate_age()
        
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
    age = serializers.SerializerMethodField()
    is_favorite = serializers.SerializerMethodField()
    favorite_id = serializers.SerializerMethodField()
    is_invited = serializers.SerializerMethodField()
    
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
            'course_rieltor_join',
            'basic_legal_course',
            'course_mortgage',
            'course_taxation',
            'completed_objects',
            'clients',
            'updated_at',
            'is_favorite',
            'favorite_id',
            'is_invited',
        ]
    def get_age(self, obj):
        """Вычисление возраста кандидата на основе его даты рождения."""
        if obj.birth:
            return obj.calculate_age()
        
    def get_is_favorite(self, obj):
        user = self.context['request'].user
        return Favorite.objects.filter(user=user, candidate=obj).exists()

    def get_favorite_id(self, obj):
        """
        Возвращает ID записи избранного, если кандидат находится в избранном.
        """
        user = self.context['request'].user
        favorite = Favorite.objects.filter(user=user, candidate=obj).first()
        return favorite.id if favorite else None
    
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
    city = serializers.SerializerMethodField()
    class Meta:
        model = Invitation
        fields = [
            'full_name',
            'city',
            'status',
            'updated_at',
        ]
    def get_full_name(self, obj):
        candidate = obj.candidate
        return f'{candidate.surname} {candidate.name} {candidate.patronymic}'
    
    def get_city(self,obj):
        candidate = obj.candidate
        return candidate.city


class AdminInvitationSerializer(serializers.ModelSerializer):
    supervisor = serializers.SerializerMethodField()
    office_name = serializers.SerializerMethodField()
    class Meta:
        model = Invitation
        fields = ['id', 'status', 'created_at','office_name' ,'supervisor', 'office'] 
    
    def get_supervisor(self, obj):
        office = obj.office
        try:
            supervisor = Supervisor.objects.get(office=office)
            user = supervisor.user
            return user.get_full_name()
        except Supervisor.DoesNotExist:
            return "Not Exist"
        
    def get_office_name(self, obj):
        return obj.office.name
    
class ArchiveCandidateSerializer(serializers.ModelSerializer):
    bio = serializers.SerializerMethodField()
    city = serializers.SerializerMethodField()
    cause = serializers.SerializerMethodField()
    
    class Meta:
        model = Candidate
        fields = [
                'id',
                'updated_at',
                'bio',
                'photo',
                'city',
                'phone',
                'email',
                'cause'
                ]
        
    def get_bio(self, obj):
        """Вычисление возраста кандидата на основе его даты рождения."""
        return f'{obj.surname} {obj.name}'
        
    def get_city(self,obj):
        if obj.city:
            return obj.city
        return ''
    
    def get_cause(self,obj):
        if obj.office:
            office = obj.office
            return office.name
        return 'не прошёл собеседование'
    
    
    

    