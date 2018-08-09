from django.db import models
from django.core.mail import send_mail


class Institution(models.Model):
    name = models.CharField(max_length=50, blank=False)
    po_box = models.CharField(max_length=20)
    city = models.CharField(max_length=20)
    number_of_visitors = models.IntegerField()
    email = models.EmailField()

    def __str__(self):
        return self.name

class PowerStation(models.Model):
    station_choices = (
            ("Masinga", "Masinga"),
            ("Kamburu", "Kamburu"),
            ("Gitaru", "Gitaru"),
            ("Kindaruma", "Kindaruma"),
            ("Kiambere", "Kiambere")
        )
    name = models.CharField(max_length=20, choices=station_choices)
    available = models.BooleanField(default=True)
    unavailable_from = models.DateField(blank=True, null=True)
    unavailable_until = models.DateField(blank=True, null=True)

    def __str__(self):
        return self.name

    # restrict from adding the same station twice while allowing for editing
    def clean(self):
        if PowerStation.objects.all().filter(name=self.name).count() >= 1 and PowerStation.objects.get(
                name=self.name).pk != self.pk:
            raise PermissionError("Cannot create the same station twice")

    def is_available(self, date):
        if self.unavailable_until == None or self.unavailable_from == None:
            self.available = True
            self.save()
            return True
        if self.unavailable_from <= date <= self.unavailable_until:
            self.available = False
            return False

        return True




class Trip(models.Model):
    time_choices = (
        ("10:00 a.m.", "10:00 a.m."),
        ("2:00 p.m.", "2:00 p.m.")
    )
    institution = models.ForeignKey(Institution, on_delete=models.CASCADE)
    station = models.ForeignKey(PowerStation, on_delete=models.CASCADE)
    time = models.CharField(choices=time_choices, max_length=10)
    date = models.DateField();
    approved = models.BooleanField(default=False)

    def __str__(self):
        return ("{} booked by {} on {} at {}".format(self.station, self.institution, self.date, self.time))

    def clean(self):
        if Trip.objects.all().filter(date=self.date).filter(station=self.station).count() >= 2:
            raise PermissionError("Cannot book station more than twice in a day")
        if self.date.weekday() > 5:
            raise PermissionError("Sorry, we do not offer academic tours on Weekends")

    # check if station is booked in the morning time of 10:00 am
    def is_booked_morning(self):
        if Trip.objects.all().filter(date=self.date).filter(institution=self.institution).filter(time="10:00 a.m."):
            return True
        else:
            return False

    # check if station is booked in the afternoo`n time of 2:00 pm
    def is_booked_afternoon(self):
        if Trip.objects.all().filter(date=self.date).filter(institution=self.institution).filter(time="2:00 p.m."):
            return True
        else:
            return False

    # approve the trip request be done by admin
    def send_request_message(self):
        subject ="Request to book powerstation for an educational tour."
        message = "Your request to visit {} on {} at {} has been received. We will notify, you once your request has been reviewed.".format(self.station.name,self.date,self.time)
        email_from = "ecom193@gmail.com"
        email_to = self.institution.email
        send_mail(subject,
                  message,
                  email_from,
                  email_to)

    def approve(self):
        self.approved = True
        # sent email to the sender that their request has been approved

    def save(self, *args, **kwargs):
        if not self.station.is_available(self.date):
            raise PermissionError("station is not available")
        if self.is_booked_morning() and self.is_booked_afternoon():
            raise PermissionError("Station is fully booked")
        elif self.time == "10:00 a.m." and self.is_booked_morning():
            raise PermissionError("Station is booked in the morning")
        elif self.time == "2:00 p.m." and self.is_booked_afternoon():
            raise PermissionError("Station is booked in the afternnon")
        else:
            self.send_request_message()
            super(Trip, self).save(*args, **kwargs)
            #send mail





