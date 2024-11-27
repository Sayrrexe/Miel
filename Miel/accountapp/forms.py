from django import forms
from django.contrib.auth.models import User


class UserLogin(forms.ModelForm):

    email = forms.EmailField(label="Email", widget=forms.EmailInput
    (attrs={'class': 'input-field', 'placeholder': 'user@mail.ru'}))
    password = forms.CharField(label='Пароль',
                               widget=forms.PasswordInput
                               (attrs={'class': 'input-field'}))

    class Meta:
        model = User
        fields = ['email']

