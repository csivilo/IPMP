from django.shortcuts import render
from django.template.context_processors import csrf
from IPsamp.models import Gompertz
from django.http import JsonResponse,HttpResponse
import json
from modules import wrapperGompertz as WG, wrapperHuangFull as WH, wrapper as WR


def index(request):


    return render(request,"IPsamp/index.html/")


def data(request):
    print("hella")
    if request.method == "GET":
        xarray = json.loads(request.GET.get("time_array"))
        yarray = json.loads(request.GET.get("conc_array"))
        model = request.GET.get('model')
        p0 = [request.GET.get('rate'),request.GET.get('lag')]

        inst = WR.dataAnalysis([xarray,yarray],p0,model)



        #create context dictionary from simulation data
        #cont = {'plot': lst}

        #return JsonResponse(cont)
