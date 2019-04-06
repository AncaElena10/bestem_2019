from django.db import models

# Create your models here.
class Test(models.Model):
    name = models.CharField(max_length=32)

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
    #user_id = models.ForeignKey('User', null=False, on_delete=models.CASCADE)
    pollution_level =  models.CharField(max_length=50, choices=LEVEL, null=False, blank=False)
    active = models.BooleanField(default=True)
