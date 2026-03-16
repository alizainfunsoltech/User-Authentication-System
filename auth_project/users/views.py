from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from django.contrib.auth.models import User
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from datetime import timedelta
from .models import UserOTP
from .serializers import SignupSerializer, OTPVerifySerializer, ProfileSerializer, LoginSerializer


# -----------------------------
# SIGNUP
# -----------------------------
class SignupView(APIView):

    def post(self, request):
        serializer = SignupSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()

            otp_obj, created = UserOTP.objects.get_or_create(user=user)

            otp = otp_obj.generate_otp()

            otp_obj.otp = otp
            otp_obj.otp_created = timezone.now()
            otp_obj.is_verified = False
            otp_obj.save()

            send_mail(
                "Email Verification OTP",
                f"Your OTP is {otp}",
                settings.EMAIL_HOST_USER,
                [user.email],
                fail_silently=False
            )

            return Response({
                "status": "success",
                "message": "Account created. OTP sent to email",
                "data": {
                    "email": user.email
                }
            }, status=201)

        return Response({
            "status": "error",
            "message": "Signup failed",
            "data": serializer.errors
        }, status=400)


# -----------------------------
# VERIFY OTP
# -----------------------------
class VerifyOTPView(APIView):

    def post(self, request):

        serializer = OTPVerifySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        otp = serializer.validated_data["otp"]

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({
                "status": "error",
                "message": "User not found"
            }, status=404)

        otp_obj, created = UserOTP.objects.get_or_create(user=user)

        if not otp_obj.otp:
            return Response({
                "status": "error",
                "message": "OTP not generated"
            }, status=400)

        if timezone.now() - otp_obj.otp_created > timedelta(minutes=5):
            return Response({
                "status": "error",
                "message": "OTP expired"
            }, status=400)

        if otp_obj.otp != otp:
            return Response({
                "status": "error",
                "message": "Invalid OTP"
            }, status=400)

        otp_obj.is_verified = True
        otp_obj.otp = None
        otp_obj.save()

        # create token
        token, created = Token.objects.get_or_create(user=user)

        return Response({
            "status": "success",
            "message": "Email verified successfully",
            "data": {
                "username": user.username,
                "token": token.key
            }
        }, status=200)


# -----------------------------
# RESEND OTP
# -----------------------------
class ResendOTPView(APIView):

    def post(self, request):

        email = request.data.get("email")

        if not email:
            return Response({"error": "Email required"}, status=400)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

        otp_obj, created = UserOTP.objects.get_or_create(user=user)

        otp = otp_obj.generate_otp()

        otp_obj.otp = otp
        otp_obj.otp_created = timezone.now()
        otp_obj.is_verified = False
        otp_obj.save()

        send_mail(
            "Your OTP Code",
            f"Your new OTP is {otp}",
            settings.EMAIL_HOST_USER,
            [email],
            fail_silently=False
        )

        return Response({
            "message": "OTP sent again"
        })


# -----------------------------
# LOGIN
# -----------------------------
class LoginView(APIView):

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        return Response(serializer.validated_data)


# -----------------------------
# PROFILE
# -----------------------------
class ProfileView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = ProfileSerializer(request.user)

        return Response(serializer.data)


# -----------------------------
# UPDATE PROFILE
# -----------------------------
class UpdateProfileView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def put(self, request):
        user = request.user

        username = request.data.get("username")

        if username:
            user.username = username

        user.save()

        return Response({
            "message": "Profile updated"
        })


# -----------------------------
# DELETE ACCOUNT
# -----------------------------
class DeleteAccountView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        request.user.delete()

        return Response({
            "message": "Account deleted"
        })


class LogoutView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        request.user.auth_token.delete()

        return Response({
            "message": "Logged out successfully"
        })
