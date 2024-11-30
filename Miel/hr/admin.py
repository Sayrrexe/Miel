from django.contrib import admin
from . import models

admin.site.register(models.CustomUser)
admin.site.register(models.Supervisor)
admin.site.register(models.Moderator)
admin.site.register(models.Candidate)
admin.site.register(models.Office)
admin.site.register(models.Favorite)
admin.site.register(models.Todo)
admin.site.register(models.Invitation)
admin.site.register(models.Transaction)
