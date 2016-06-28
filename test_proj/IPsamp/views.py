from django.shortcuts import render
from django.template.context_processors import csrf
from IPsamp.models import Gompertz
from django.http import JsonResponse,HttpResponse
import json
from modules import wrapperGompertz as WG, wrapperHuangFull as WH, wrapper as WR


def index(request):


    return render(request,"IPsamp/index.html/")


def model(request):
    print("hella")
    if request.method == "GET":
        xarray = json.loads(request.GET.get("time_array"))
        yarray = json.loads(request.GET.get("conc_array"))
        model = request.GET.get('model')
        p0 = [request.GET.get('rate'),request.GET.get('lag')]

        inst = WR.dataAnalysis([xarray,yarray],p0,model)





    return HttpResponse("Hello")

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
