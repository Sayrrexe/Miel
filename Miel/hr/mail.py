from django.core.mail import send_mail, get_connection
from django.conf import settings

def send_password_mail(username, password, email):
    subject = 'Вам был выдан доступ к сервису MIEL "Витрина Кандидатов"'
    message = (
        'Вам был выдан доступ к сервису Miel "Витрина кандидатов"\n'
        'Перейдите по ссылке http://80.85.246.168/\n'
        f'Ваш логин для доступа: {username}\n'
        f'Ваш пароль: {password}'
    )
    recipient_list = [email]

    try:        
        send_mail(
            subject=subject,
            message=message,
            from_email=None,  
            recipient_list=recipient_list,
        )
        print('письмо отправлено на почту ', email)
        return True
    except Exception as e:
        print(e)
        return False
