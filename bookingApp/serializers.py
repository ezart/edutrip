from rest_framework import serializers
from .models import *

class TripSerializer(serializers.ModelSerializer):
    #url = serializers.HyperlinkedIdentityField(view_name="bookingApp:institution-detail")
    class Meta:
        model = Trip
        fields ='__all__'

class InstitutionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Institution
        fields = '__all__'

class PowerStationSerializer(serializers.ModelSerializer):

    class Meta:
        model = PowerStation
        fields ='__all__'
