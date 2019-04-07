from rest_framework import viewsets, response
from app.models import Test, TrashPoint, Event, ExtendedUser
from .serializers import TestSerializer, TrashPointSerializer, EventSerializer, ManageAccountSerializer
from rest_framework.decorators import list_route, detail_route
from django.contrib.auth.models import User, AnonymousUser
from rest_framework.parsers import FileUploadParser
from .helpers import email

class TestViewSets(viewsets.ModelViewSet):
    queryset = Test.objects.all()
    serializer_class = TestSerializer

    @list_route(methods=['get'])
    def list_test(self, request, **kwargs):
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
    
    @list_route(methods=['get'])
    def get_user_info(self, request, **kwargs):
        if request.user.is_anonymous:
            return response.Response(status=400, data={'error': 'User is not logged!'})
        serializer = self.get_serializer(request.user)
        return response.Response(serializer.data)
        
    @list_route(methods=['post'])
    def gamification(self, request, **kwargs):
        username = request.data.get('username')
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return response.Response(status=404, data={'error': 'User does not exist'})
        try:
            extendedUser = ExtendedUser.objects.get(user_id=user.id)
        except User.DoesNotExist:
            return response.Response(status=404, data={'error': 'Except User does not exist'})  

        points = extendedUser.points
        number_events_created = Event.objects.filter(owner=user).count()
        number_events_participated = Event.objects.filter(users__username=username).count()
        number_places_reported = TrashPoint.objects.filter(user=user).count()
        return response.Response(status=200, data={
            'username':username,
            'points':points,
            'number_events_created':number_events_created,
            'number_events_participated':number_events_participated,
            'number_places_reported':number_places_reported
            })


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
                total_points += 50
            if trash.pollution_level == TrashPoint.MEDIUM:
                total_points += 40      
            if trash.pollution_level == TrashPoint.LOW:
                total_points += 30
            
            trash.event = event
            trash.save()

        try:
            user = ExtendedUser.objects.get(user_id=owner.id)
            user.points += total_points
            user.save()
        except:
            pass

        subject = "A new event was created"
        message = """Hello!\nWe are happy to inform you that a new event was successfully created by you.\nYour proactivity is rewarded with {} points.\nEnjoy it :)!""".format(total_points)
        
        email(owner.email, subject, message)
        return response.Response(status=200, data={'error': 'Success'})

    @list_route(methods=['get'])
    def list_events(self, request, **kwargs):
        if request.user.is_anonymous:
            return response.Response(status=400, data={'error': 'User is not logged!'})
        
        events = Event.objects.all()
        serializer = self.get_serializer(events, many=True)
        return response.Response(serializer.data)

    @list_route(methods=['post'])
    def join_event(self, request, **kwargs):
        if request.user.is_anonymous:
            return response.Response(status=400, data={'error': 'User is not logged!'})
        id = request.data.get('id')

        try:
            event = Event.objects.get(id=id)
        except:
            return response.Response(status=404)
        
        event.users.add(request.user)
        event.save()

        total_points = 15
        try:
            user.points += total_points
            user.save()
        except:
            pass

        subject = "Event participation"
        message = """Hello!\nWe are happy to inform you that you successfully joined the event.\nYour interest is rewarded with {} points.\nEnjoy it :)!""".format(total_points)
        
        email(owner.email, subject, message)

        return response.Response(serializer.data)

    @list_route(methods=['post'])
    def close_event(self, request, **kwargs):
        if request.user.is_anonymous:
            return response.Response(status=400, data={'error': 'User is not logged!'})
        id = request.data.get('id')

        try:
            event = Event.objects.get(id=id)
        except:
            return response.Response(status=404)
        
        for tp in event.trashpoint_set.all()
            tp.active = False
            tp.save()
        
        event.status = Event.COMPLETED
        event.save()
        return response.Response(status=200)

def frequencyDistribution(data):
    return {i: data.count(i) for i in data}   

class ChartsViewSets(viewsets.ModelViewSet):
    queryset = TrashPoint.objects.all()
    serializer_class = TrashPointSerializer
    
    @list_route(methods=['post'])
    def trash_clean(self, request, **kwargs):
        total = TrashPoint.objects.count()
        clean = TrashPoint.objects.filter(active=False).count()
        dirty = total - clean
        return response.Response(status=200, data={
            'clean':clean,
            'dirty':dirty,
            'total':total})

    @list_route(methods=['post'])
    def trash_level(self, request, **kwargs):
        total = TrashPoint.objects.count()
        low = TrashPoint.objects.filter(pollution_level=TrashPoint.LOW).count()
        medium = TrashPoint.objects.filter(pollution_level=TrashPoint.MEDIUM).count()
        high = TrashPoint.objects.filter(pollution_level=TrashPoint.HIGH).count()
        return response.Response(status=200, data={
            'low':low,
            'medium':medium,
            'high':high,
            'total':total})    

    @list_route(methods=['post'])
    def event_people(self, request, **kwargs):
        total = Event.objects.count()
        events = Event.objects.all()
        list_people = []
        for event in events:
            list_people.append(event.users.count())
        freq = frequencyDistribution(list_people)
        return response.Response(status=200, data={
            'data':freq,
            'total':total})       

    @list_route(methods=['post'])
    def event_places(self, request, **kwargs):
        total = Event.objects.count()
        list_places = []
        events = Event.objects.all()
        for event in events:
            number_places = TrashPoint.objects.filter(event=event).count()
            list_places.append(number_places)
        freq = frequencyDistribution(list_places)
        return response.Response(status=200, data={
            'data':freq,
            'total':total})       
            
