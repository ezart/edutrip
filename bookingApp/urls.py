from .views import  *
from django.urls import path,re_path
from . import views
from django.views.decorators.csrf import csrf_exempt

app_name= "bookingApp"

urlpatterns =[
    path('',views.index,name="home"),
    path('book_trip', views.book_trip, name="book_trip"),
    path('api/create_trip/',views.CreateTrip.as_view()),
    path('api/add_institution/',views.CreateInstitution.as_view(),name="add-institution"),
    path('api/get_institution/<name>/',views.GetInstitution.as_view(),name="get-institution"),
    path('api/stations/',views.ViewStations.as_view(),name="view_all_stations"),
    re_path('api/station/(?P<date>[0-9]{4}-?[0-9]{2}-?[0-9]{2})/$', views.ViewAvailableStations.as_view(), name="view_stations"),
    path('api/<station>/',views.ViewFullyBookedDays.as_view(), name="view_fully_booked_days")
]