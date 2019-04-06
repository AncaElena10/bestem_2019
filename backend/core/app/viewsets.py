from rest_framework import viewsets, response
from app.models import Test
from .serializers import TestSerializer
from rest_framework.decorators import list_route, detail_route
from django.contrib.auth.models import User

class TestViewSets(viewsets.ModelViewSet):
    queryset = Test.objects.all()
    serializer_class = TestSerializer

    @list_route(methods=['get'])
    def list_test(self, request, **kwargs):
        print(request.user)
        print("ALOOOOO")
        tests = Test.objects.all()
        serializer = self.get_serializer(tests, many=True)
        return response.Response(serializer.data)