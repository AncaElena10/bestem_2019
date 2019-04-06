from rest_framework import viewsets, response
from app.models import Test, TrashPoint
from .serializers import TestSerializer, TrashPointSerializer
from rest_framework.decorators import list_route, detail_route
from django.contrib.auth.models import User, AnonymousUser
from .views import email
from rest_framework.parsers import FileUploadParser

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

    @list_route(methods=['post'])
    def myemail(self, request, **kwargs):
        # blabal
        email(request)

class TrashPointViewSets(viewsets.ModelViewSet):
    parser_class = (FileUploadParser,)
    queryset = TrashPoint.objects.all()
    serializer_class = TrashPointSerializer

    @list_route(methods=['post'])
    def create_trashpoint(self, request, **kwargs):
        if request.user.is_anonymous:
            return response.Response(status=400, data={'error': 'User is not logged!'})
        
        lat = request.data.get('lat')
        lng = request.data.get('lng')
        level = request.data.get('level')
        picture = request.data.get('picture')
        user = request.user

        tp = TrashPoint.objects.create(
            x_coord=lat,
            y_coord=lng,
            user=user,
            pollution_level=level,
            picture=picture,
        )
        serializer = self.get_serializer(tp)
        return response.Response(serializer.data)

    @list_route(methods=['get'])
    def get_trashpoints(self, request, **kwargs):
        if request.user.is_anonymous:
            return response.Response(status=400, data={'error': 'User is not logged!'})
        
        trahspoints = TrashPoint.objects.all()
        serializer = self.get_serializer(trahspoints, many=True)
        return response.Response(serializer.data)