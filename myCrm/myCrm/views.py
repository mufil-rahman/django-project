from django.shortcuts import render

def home(request):
    return render(request, 'index.html')

def records(request):
    return render(request, 'record.html')
