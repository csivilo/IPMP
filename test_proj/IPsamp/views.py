from django.shortcuts import render
from django.core.context_processors import csrf
from IPsamp.models import Gompertz
from django.http import JsonResponse
import json


def index(request):


    return render(request,"IPsamp/index.html/")

def data(request):
    if request.method == 'GET':
        nO = int(request.GET.get("nO"))
        nmax = int(request.GET.get('nmax'))
        rate = int(request.GET.get('rate'))
        time = int(request.GET.get('time'))
        m = int(request.GET.get('m'))




        #create model object for data
        gompertz_model = Gompertz(
            nO = nO,
            nmax = nmax,
            rate = rate,
            time = time,
            m = m
        )

        #run simulation over time range
        lst = gompertz_model.runSim(time+10,10)

        #create context dictionary from simulation data
        cont = {'plot': lst}

        return JsonResponse(cont)
