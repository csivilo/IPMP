from django.shortcuts import render
from django.template.context_processors import csrf
from IPsamp.models import Gompertz
from django.http import JsonResponse,HttpResponse
import json

from modules import wrapperGompertz as WG, wrapperHuangFull as WH, wrapperBaranyiFull as WB, \
    wrapperBaranyiFixedH0 as WBF,wrapperBuchanan as WBu, report as RP, wrapperTwoPhaseBuchanan as WTB,\
    wrapperNoLagPhase as WNL, wrapperReducedBaranyi as WRB, wrapperReducedHuang as WRH, wrapperLinearSurvival as WSL,\
    wrapperLinearWithTailSurvival as WSLS, wrapperGompertzSurvival as WSG, wrapperWeibullSurvival as WSW,\
    wrapperWeibullMafartSurvival as WSM, wrapperBuchananShoulderLinearSurvival as WSBSL, \
    wrapperBuchananThreePhaseLinearSurvival as WSBTL, wrapperArrheniusFullTemp as WAF,\
    wrapperArrheniusSuboptimalTemp as WAS, wrapperCardinalFullTemp as WC, \
    wrapperHuangFullTemp as WHFT, wrapperHuangSubTemp as WHST, \
    wrapperRatkowskyFullTemp as WRF, wrapperRatkowskySubTemp as WRS
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

        elif model == "Huang":

            inst = WH.dataAnalysis([xarray, yarray], p0)

        elif model == "Baranyi":

            inst = WB.dataAnalysis([xarray, yarray], p0)

        elif model == "Buchanan":

            inst = WBu.dataAnalysis([xarray, yarray], p0)


        elif model == "No_lag":

            inst = WNL.dataAnalysis([xarray, yarray], p0)

        elif model == "R_baranyi":

            inst = WRB.dataAnalysis([xarray, yarray], p0)

        elif model == "R_huang":

            inst = WRH.dataAnalysis([xarray, yarray], p0)

        elif model == "2_buchanan":

            inst = WTB.dataAnalysis([xarray, yarray], p0)

        elif model == "S_linear":

            inst = WSL.dataAnalysis([xarray,yarray])

        elif model == "S_linshoulder":

            inst = WSLS.dataAnalysis([xarray, yarray])

        elif model == "S_gompertz":

            inst = WSG.dataAnalysis([xarray, yarray], p0)

        elif model == "S_weibull":

            inst = WSW.dataAnalysis([xarray, yarray], p0)

        elif model == "S_mafar":

            inst = WSM.dataAnalysis([xarray, yarray], p0)

        elif model == "S2_buchanan":

            inst = WSBSL.dataAnalysis([xarray, yarray], p0)
        elif model == "S3_buchanan":

            inst = WSBTL.dataAnalysis([xarray, yarray], p0)

        elif model == "Arrhenius_full":

            inst = WAF.dataAnalysis([xarray,yarray], p0)

        elif model == "Arrhenius_sub":

            inst = WAS.dataAnalysis([xarray, yarray], p0)

        elif model == "Cardinal_full":
             
            inst = WC.dataAnalysis([xarray, yarray], p0)

        elif model == "Huang_full_temp":

            inst = WHFT.dataAnalysis([xarray, yarray], p0)

        elif model == "Huang_sub_temp":

            inst = WHST.dataAnalysis([xarray, yarray], p0)

        elif model == "Ratkowsky_full":

            inst = WRF.dataAnalysis([xarray, yarray], p0)

        elif model == "Ratkowsky_sub":

            inst = WRS.dataAnalysis([xarray, yarray], p0)


        #create context dictionary from simulation data
        #cont = {'plot': lst}
        #dict = inst.report
        dict = {"error": str(inst.errorMessage)}

        if inst.errorMessage == "successful":
            dict["text_output"] = RP.report(inst)
            #dict["ci_vals"] = RP.conintervals(inst)
            dict['params'] = RP.params(inst)


        return JsonResponse(dict)
