from django.contrib import admin
from .models import Test, Event, TrashPoint, ExtendedUser

# Register your models here.
@admin.register(Test)
class TestAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('id', 'status', 'name', 'owner', 'date', 'total_persons', 'extra')

@admin.register(TrashPoint)
class TrashPointAdmin(admin.ModelAdmin):
    list_display = ('id', 'x_coord', 'y_coord', 'user', 'pollution_level', 'active', 'event')

@admin.register(ExtendedUser)
class ExtendedUserAdmin(admin.ModelAdmin):
    list_display = ('user', 'phone', 'points', 'role')    