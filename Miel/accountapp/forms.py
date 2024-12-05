from django import forms
from django.contrib.auth.models import User


class UserLogin(forms.ModelForm):
    username = forms.CharField(widget=forms.TextInput(attrs={'class': 'input-field'}))
    password = forms.CharField(label='Пароль',
                               widget=forms.PasswordInput
                               (attrs={'class': 'input-field'}))

    class Meta:
        model = User
        fields = ('username', 'password')
