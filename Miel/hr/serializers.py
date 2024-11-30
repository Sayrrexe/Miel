from rest_framework import serializers
from .models import Supervisor, Todo, Candidate

class SupervisorSerializer(serializers.ModelSerializer):
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



class CandidateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Candidate
        fields = [
            'is_active',
            'name',
            'birth',
            'email',
            'phone',
            'resume',
            'is_staff',
            'office'
            'created_at',
            'updated_at',
        ]