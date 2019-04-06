from rest_framework import serializers
from .models import Test, TrashPoint

class TestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Test
        fields = ('id', 'name')

class TrashPointSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrashPoint
        fields = ('id', 'x_coord', 'y_coord', 'user_id', 'pollution_level', 'active', 'event', 'picture')