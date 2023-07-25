from django.urls import path
from . import views

urlpatterns = [
  path("", views.index),
  path("get_next_random_flag/", views.getNextRandomFlag, name="get_next_random_flag"),
]
