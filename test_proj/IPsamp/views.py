from django.shortcuts import render
from django.template.context_processors import csrf
from IPsamp.models import Gompertz
from django.http import JsonResponse,HttpResponse
import json
from modules import wrapperGompertz as WG, wrapperHuangFull as WH, wrapperBaranyiFull as WB, wrapperBaranyiFixedH0 as WBF


def index(request):


    return render(request,"IPsamp/index.html/")


def data(request):
    print("hella")
    if request.method == "GET":
        xarray = json.loads(request.GET.get("time_array"))
        yarray = json.loads(request.GET.get("conc_array"))
        model = request.GET.get('model')
        p0 = [request.GET.get('rate'),request.GET.get('lag')]



        if model == "Gompertz":
            print("Gompertz")
            inst = WG.dataAnalysis([xarray,yarray],p0)
        elif model == "Huang":
            print("Huang")
            inst = WH.dataAnalysis([xarray, yarray], p0)
        elif model == "Baranyi":
            print("Baranyi")
            inst = WB.dataAnalysis([xarray, yarray], p0)


        #create context dictionary from simulation data
        #cont = {'plot': lst}

        #return JsonResponse(cont)
