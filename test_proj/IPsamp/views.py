from django.shortcuts import render

def index(request):
    return render(request,"IPsamp/index.html")

def sample(request):
    return render(request,"IPsamp/01.html")

