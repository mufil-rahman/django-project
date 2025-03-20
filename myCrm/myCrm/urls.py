
from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home, name='home'),
    path('api/', include('api.urls')),
    path('registration/', views.registration, name='registration'),
]
