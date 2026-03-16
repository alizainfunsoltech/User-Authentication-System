from django.contrib.auth.models import User
from django.utils import timezone
from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from .models import UserOTP


class SignupSerializer(serializers.ModelSerializer):

    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["username", "email", "password"]

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists")
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already registered")
        return value

    def create(self, validated_data):

        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"]
        )

        return user

class OTPVerifySerializer(serializers.Serializer):

    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)

    def validate(self, data):

        email = data.get("email")
        otp = data.get("otp")

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("User not found")

        try:
            user_otp = UserOTP.objects.get(user=user)
        except UserOTP.DoesNotExist:
            raise serializers.ValidationError("OTP not generated")

        if user_otp.otp != otp:
            raise serializers.ValidationError("Invalid OTP")

        return data


class LoginSerializer(serializers.Serializer):

    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):

        username = data.get("username")
        password = data.get("password")

        user = authenticate(username=username, password=password)

        if not user:
            raise serializers.ValidationError("Invalid credentials")

        otp_obj, created = UserOTP.objects.get_or_create(user=user)

        if not otp_obj.is_verified:

            otp = otp_obj.generate_otp()

            otp_obj.otp = otp
            otp_obj.otp_created = timezone.now()
            otp_obj.save()

            raise serializers.ValidationError({
                "verify_required": True,
                "message": "Email verification required",
                "email": user.email
            })

        # token, created = Token.objects.get_or_create(user=user)
        token, created = Token.objects.get_or_create(user=user)
        return {
            "message": "Login successful",
            "token": token.key
        }


class ProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ["id", "username", "email"]