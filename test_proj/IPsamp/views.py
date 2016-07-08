from django.shortcuts import render
from django.template.context_processors import csrf
from IPsamp.models import Gompertz
from django.http import JsonResponse,HttpResponse
import json
from modules import wrapperGompertz as WG, wrapperHuangFull as WH, wrapperBaranyiFull as WB, \
    wrapperBaranyiFixedH0 as WBF,wrapperBuchanan as WBu
import numpy as np

def index(request):


    return render(request,"IPsamp/index.html/")


def data(request):
    if request.method == "GET":
        xarray = []
        yarray = []
        xjson = json.loads(request.GET.get("time_array"))
        for i in xjson:
            xarray.append(float(i))
        xarray = np.array(xarray)
        yjson = json.loads(request.GET.get("conc_array"))
        for i in yjson:
            yarray.append(float(i))
        yarray = np.array(yarray)
        model = request.GET.get('model')
        p0 = [float(request.GET.get('rate')),float(request.GET.get('lag'))]



        if model == "Gompertz":

            inst = WG.dataAnalysis([xarray,yarray],p0)
            dict = inst.report

        elif model == "Huang":

            inst = WH.dataAnalysis([xarray, yarray], p0)
        elif model == "Baranyi":

            inst = WB.dataAnalysis([xarray, yarray], p0)
        elif model == "Buchanan":

            inst = WBu.dataAnalysis([xarray, yarray], p0)


        #create context dictionary from simulation data
        #cont = {'plot': lst}

        return JsonResponse(dict)
