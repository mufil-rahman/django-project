
from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path("api-auth/", include("rest_framework.urls")),
    path('', views.home, name='home'),
    path('record/', views.records, name='registration'),
]
