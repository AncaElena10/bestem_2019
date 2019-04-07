from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Test(models.Model):
    name = models.CharField(max_length=32)

class Event(models.Model):
    ACTIVE = "Active"
    COMPLETED = "Completed"

    STATUS = (
        (ACTIVE, "Active"),
        (COMPLETED, "Completed")
    )
    name = models.CharField(max_length=32)
    users = models.ManyToManyField(User, blank=True)
    date = models.DateTimeField()
    total_persons = models.IntegerField(null=True, blank=True)
    extra = models.TextField(null=True, blank=True)
    status =  models.CharField(max_length=50, choices=STATUS, default=ACTIVE)
    owner = models.ForeignKey(User, null=True, related_name="owner", on_delete=models.CASCADE)
    address = models.TextField(null=True, blank=True)

    def __str__(self):
        return "{}".format(self.name)

class TrashPoint(models.Model):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"

    LEVEL = (
        (LOW, "Low"),
        (MEDIUM, "Medium"),
        (HIGH, "High"),
    )

    x_coord = models.FloatField()
    y_coord = models.FloatField()
    user = models.ForeignKey(User, null=False, on_delete=models.CASCADE)
    pollution_level =  models.CharField(max_length=50, choices=LEVEL, null=False, blank=False)
    active = models.BooleanField(default=True)
    event = models.ForeignKey(Event, null=True, blank=True, on_delete=models.CASCADE)
    picture = models.FileField(blank=True, null=True)

    def __str__(self):
        return "Trash Point {}".format(self.id)

class ExtendedUser(models.Model):
    VOLUNTEER = "Volunteer"
    COLLECTOR = "Collector"
    ADMIN = "Admin"
    INFO = "Info"

    ROLE = (
        (VOLUNTEER, "Volunteer"),
        (COLLECTOR, "Collector"),
        (ADMIN, "Admin"),
        (INFO, "Info"),
    )

    user = models.ForeignKey(User, null=True, on_delete=models.CASCADE)
    phone = models.CharField(max_length=20)
    points = models.IntegerField(default=0)
    role =  models.CharField(max_length=50, choices=ROLE, null=False, blank=False)
    