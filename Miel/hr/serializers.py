from os import read
from rest_framework import serializers
from .models import Favorite, Supervisor, Todo, Candidate, Invitation

class InfoAboutSupervisor(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    email = serializers.EmailField(source='user.email', read_only=True)
    phone = serializers.CharField(source='user.profile.phone', read_only=True)  # Если у пользователя есть поле телефона
    office_name = serializers.CharField(source='office.name', read_only=True)
    office_location = serializers.CharField(source='office.location', read_only=True)

    class Meta:
        model = Supervisor
        fields = [
            'full_name',    # Полное имя пользователя
            'email',        # Email пользователя
            'phone',        # Номер телефона пользователя
            'office_name',  # Название офиса
            'office_location',  # Локация офиса
            'department'    # Подразделение
        ]

    def get_full_name(self, obj):
        return obj.user.get_full_name()


class TodoSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)  # Отображение имени пользователя вместо ID

    class Meta:
        model = Todo
        fields = ['id', 'user', 'task', 'due_date']
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
    
    
        
class FavoriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favorite
        fields = [
                    'candidate', 
                    'created_at'
                  ]  
        read_only_fields = ['created_at']
        
class SupervisorSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='user.get_full_name', read_only=True)

    class Meta:
        model = Supervisor
        fields = ['id', 'user', 'office', 'department', 'full_name']