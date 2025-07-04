from django.db import models

# Create your models here.

class Flag(models.Model):
  name = models.CharField(max_length=200)
  image = models.ImageField(upload_to='flags_images')


  def __str__(self) -> str:
    return f"{self.name}"
