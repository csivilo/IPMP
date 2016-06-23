from django.shortcuts import render
from django.core.context_processors import csrf
from IPsamp.models import Gompertz
from django.shortcuts import HttpResponse
import json


def index(request):


    return render(request,"IPsamp/index.html/")

def data(request):
    if request.method == 'POST':
        print(request.POST.dict())

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




        #create context dictionary from simulation data
        cont = {'plot': lst}

        jarray = json.dumps(cont)

        print(jarray)


        return HttpResponse(jarray, content_type="application/json")
