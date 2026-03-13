from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin


class CustomUserAdmin(UserAdmin):

    list_display = (
        "username",
        "email",
        "get_verified",
        "is_active",
        "is_staff",
    )

    list_editable = (
        "is_active",
        "is_staff",
    )

    list_filter = (
        "is_active",
        "is_staff",
    )

    search_fields = (
        "username",
        "email",
    )

    fieldsets = (
        (None, {"fields": ("username", "email", "password")}),
        ("Permissions", {"fields": ("is_active", "is_staff")}),
    )

    def get_verified(self, obj):
        otp = getattr(obj, "userotp", None)
        return otp.is_verified if otp else False

    get_verified.boolean = True
    get_verified.short_description = "Verified"


admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)
