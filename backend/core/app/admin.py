from django.contrib import admin
from .models import Test

# Register your models here.
@admin.register(Test)
class TestAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
