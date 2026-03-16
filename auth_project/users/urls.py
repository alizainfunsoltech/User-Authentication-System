from django.urls import path
from .views import *

urlpatterns = [

    path("signup/", SignupView.as_view()),
    path("verify-otp/", VerifyOTPView.as_view()),
    path("resend-otp/", ResendOTPView.as_view()),
    path("login/", LoginView.as_view()),
    path("profile/", ProfileView.as_view()),
    path("update/", UpdateProfileView.as_view()),
    path("delete/", DeleteAccountView.as_view()),
    path("logout/", LogoutView.as_view())
]
