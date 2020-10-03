from django.shortcuts import render
from rest_framework import generics
from datetime import datetime
from .models import *
from .serializers import *
import json


# Create your views here.
def index(request):
    return render(request, 'bookingApp/index.html', {})


def book_trip(request):
    return render(request, 'bookingApp/book_trip.html', {})


class CreateInstitution(generics.CreateAPIView):
    queryset = Institution.objects.all()
    serializer_class = InstitutionSerializer


class CreateTrip(generics.CreateAPIView):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer


class ViewStations(generics.ListAPIView):
    queryset = PowerStation.objects.all()
    serializer_class = PowerStationSerializer


class GetInstitution(generics.RetrieveAPIView):
    serializer_class = InstitutionSerializer

    def get_queryset(self):
        name = self.kwargs['name']
        inst = Institution.objects.all().filter(name=name)
        return inst


class ViewAvailableStations(generics.ListAPIView):
    serializer_class = PowerStationSerializer

    def get_queryset(self):
        """
        Get available stations on some date
        :return:
        """
        date = datetime.strptime(self.kwargs['date'], "%Y-%m-%d").date()
        ps = []
        for i in PowerStation.objects.all():
            if i.is_available(date):
                ps.append(i)
        return ps


class ViewFullyBookedDays(generics.ListAPIView):
    serializer_class = TripSerializer

    def get_queryset(self):
        dates = []
        name = self.kwargs['station']
        station = PowerStation.objects.get(name=name)
        trips_same_day = []
        trips = Trip.objects.all().filter(station=station)

        for t in trips:
            date = t.date
            if trips.filter(date=date).count() >= 1:
                trips_same_day.append(t)

        return trips_same_day

#Refactor these two so that you will only have to make a single  api call


