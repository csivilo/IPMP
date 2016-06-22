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


     return render(request, "IPsamp/index.html/")
