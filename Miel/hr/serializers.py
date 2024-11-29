from rest_framework import serializers
from .models import Supervisor
class SupervisorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supervisor
        fields = ['user','office','department']
