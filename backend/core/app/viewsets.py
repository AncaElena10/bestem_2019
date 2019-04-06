from rest_framework import viewsets, response
from app.models import Test, TrashPoint, Event, ExtendedUser
from .serializers import TestSerializer, TrashPointSerializer, EventSerializer, ManageAccountSerializer
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
        
        trahspoints = TrashPoint.objects.filter(active=True)
        serializer = self.get_serializer(trahspoints, many=True)
        return response.Response(serializer.data)

class ManageAccountViewSets(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = ManageAccountSerializer

    @list_route(methods=['post'])
    def register(self, request, **kwargs):
        email = request.data.get('email')
        password = request.data.get('password')
        firstName = request.data.get('firstName')
        lastName = request.data.get('lastName')
        username = request.data.get('username')
        phone = str(request.data.get('phone'))
        role = request.data.get('role')
        
        user = User.objects.create_user(username, password)
        user.email = email
        user.first_name = firstName
        user.last_name = lastName        
        user.save()

        extendedUser = ExtendedUser.objects.create(
            user_id=user,
            phone=phone,
            role=role,
        )
        extendedUser.save()

        return response.Response(status=200, data={'error': 'Success'})

    @list_route(methods=['get'])
    def total_points(self, request, **kwargs):
        if request.user.is_anonymous:
            return response.Response(status=400, data={'error': 'User is not logged!'})
        
        try:
            user = ExtendedUser.objects.get(user_id=request.user.id)
        except:
            return response.Response(status=200, data={'points': None})
        return response.Response(status=200, data={'points': user.points})
        
    
class ManageEventViewSets(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

    @list_route(methods=['post'])
    def create_event(self, request, **kwargs):
        if request.user.is_anonymous:
            return response.Response(status=400, data={'error': 'User is not logged!'})
        
        name = request.data.get('name')
        extra = request.data.get('extra')
        date = request.data.get('date')
        total_persons = request.data.get('total_persons')
        address = request.data.get('address')
        trash_ids = request.data.get("ids")
        owner = request.user
        
        event = Event.objects.create(
            name=name,
            extra=extra,
            date=date,
            total_persons=total_persons,
            owner=owner,
            address=address,
        )

        total_points = 0
        for ti in trash_ids:
            try:
                trash = TrashPoint.objects.get(id=ti)
            except:
                return response.Response(status=404)

            if trash.pollution_level == TrashPoint.HIGH:
                total_points += 20
            if trash.pollution_level == TrashPoint.MEDIUM:
                total_points += 10      
            if trash.pollution_level == TrashPoint.LOW:
                total_points += 5
            
            trash.event = event
            trash.save()

        try:
            user = ExtendedUser.objects.get(user_id=owner.id)
            user.points += total_points
            user.save()
        except:
            pass

        return response.Response(status=200, data={'error': 'Success'})
