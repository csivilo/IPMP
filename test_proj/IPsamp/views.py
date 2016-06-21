from django.shortcuts import render
from django.core.context_processors import csrf
import StaticPrimaryGrowth as SPG
from IPsamp.models import Gompertz

def index(request):
    return render(request,"IPsamp/index.html/")

def data(request):
     if request.method == 'POST':
        nO = int(request.Post['nO'])
        nmax = int(request.Post['nmax'])
        rate = int(request.Post['rate'])
        time = int(request.Post['time'])
        m = int(request.Post['m'])

        gompertz_model = Gompertz(
            nO = nO,
            nmax = nmax,
            rate = rate,
            time = time,
            m = m
        )
        gompertz_model.save()

        lst = []
        for i in range(10):
            lst.append(growth_model.getTime(),growth_model.getY())
            growth_model.setTime(1+ growth_model.getTime())
     return render(request, "IPsamp/index.html/")
