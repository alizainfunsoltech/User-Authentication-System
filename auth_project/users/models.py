from django.db import models
from django.contrib.auth.models import User
import random


class UserOTP(models.Model):

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    otp = models.CharField(max_length=6, blank=True, null=True)
    otp_created = models.DateTimeField(null=True, blank=True)
    is_verified = models.BooleanField(default=False)

    def generate_otp(self):
        return str(random.randint(100000, 999999))

    def __str__(self):
        return self.user.username