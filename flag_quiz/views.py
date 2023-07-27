import random
from django.http import JsonResponse
from django.shortcuts import render
from .models import Flag

# Create your views here.

def index(request):  
  all_flags = Flag.objects.all()
  flags_data = []
  for obj in all_flags:
    flags_data.append({'name': obj.name, 'image': obj.image.url})

  rows = [flags_data[i:i+6] for i in range(0, len(flags_data), 6)]
  return render(request, "flag_quiz/flag-quiz.html", {
    'rows': rows,
  })


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