from django.shortcuts import render

def home(request):
    return render(request, 'home.html')

def registration(request):
    return render(request, 'registration.html')