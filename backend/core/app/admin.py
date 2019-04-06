from django.contrib import admin
from .models import Test, Event, TrashPoint

# Register your models here.
@admin.register(Test)
class TestAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('name', 'date', 'total_persons', 'extra')

@admin.register(TrashPoint)
class TrashPointAdmin(admin.ModelAdmin):
    list_display = ('x_coord', 'y_coord', 'user_id', 'pollution_level', 'active', 'event')