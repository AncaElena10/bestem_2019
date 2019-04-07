from rest_framework import serializers
from .models import Test, TrashPoint, Event, ExtendedUser
from django.contrib.auth.models import User

class TestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Test
        fields = ('id', 'name')

class TrashPointSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrashPoint
        fields = ('id', 'x_coord', 'y_coord', 'user_id', 'pollution_level', 'active', 'event', 'picture')

class ManageAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'password', 'first_name', 'last_name') 

    read_only_fields = (
        'get_type'
    )

    def get_type(self, obj):
        try:
            user = ExtendedUser.objects.get(user_id=obj.id)
        except:
            return None
        return user.role 

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'

    read_only_fields = (
        'total_people'
    )
    
    def get_total_people(self, obj):
        return obj.users.count() + 1