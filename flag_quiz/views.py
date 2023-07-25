import random
from django.http import JsonResponse
from django.shortcuts import render
from .models import Flag

# Create your views here.

def index(request):  
  return render(request, "flag_quiz/flag-quiz.html")


def getNextRandomFlag(request):
  all_flags = Flag.objects.all()
  random_flag = random.choice(all_flags)
  total_num_of_flags = Flag.objects.count()
  data = {
    'name': random_flag.name,
    'image': random_flag.image.url,
    'total_flag': total_num_of_flags,
  }
  return JsonResponse(data=data)