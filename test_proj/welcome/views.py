from django.shortcuts import render

def index(request):
    return render(request, 'welcome/welcome.html')

# Create your views here.
