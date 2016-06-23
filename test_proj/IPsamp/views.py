from django.shortcuts import render
from django.core.context_processors import csrf
from IPsamp.models import Gompertz
from django.http import JsonResponse
import json


def index(request):


    return render(request,"IPsamp/index.html/")

def data(request):
    if request.method == 'POST':
        nO = int(request.POST.get("nO"))
        nmax = int(request.POST.get('nmax'))
        rate = int(request.POST.get('rate'))
        time = int(request.POST.get('time'))
        m = int(request.POST.get('m'))




        #create model object for data
        gompertz_model = Gompertz(
            nO = nO,
            nmax = nmax,
            rate = rate,
            time = time,
            m = m
        )

        #run simulation over time range
        lst = gompertz_model.runSim(time+10,40)
        print(lst)

        #create context dictionary from simulation data
        cont = {'plot': lst}


        return JsonResponse(cont)
