# -*- coding: utf-8 -*-
"""
Created on Sat Jun 25 18:58:23 2016

@author: Lihan_Huang
"""
import numpy as np
import StaticFullGrowthModel.FitGompertz as GM
import ErrorAnalysis.errorEstimate as EA
import ErrorAnalysis.jacobian as JA
import ErrorAnalysis.calculateConfidenceIntervals as CI
class dataAnalysis():
    def __init__(self, rawdata, p0, model):
        self.rawdata = rawdata
        self.p = p0
        self.model = model
        print "model = ", model
        
        if model == "Gompertz":
            self.calculation = GM.FitGompertz(rawdata, p0)
            self.errorEstimate = EA.errorEstimate(rawdata[0], self.calculation.pOut, self.calculation.cov, self.calculation.residual, self.calculation.YPredictedValue)
            print "SSE = ", self.errorEstimate.SSE  
            print "RMSE = ", self.errorEstimate.RMSE
            print "Residual stdev = ", self.errorEstimate.residErr_std
            print "AIC = ", self.errorEstimate.AIC
            print "Crtitcal t = ", self.errorEstimate.t_critical
            """
            self.errorEstimate produces two important outputs
            1. modelAnalysis, self..modelAnalysisOutput
                self.modelAnalysisOutput includes:
                     1) number of data points
                     2) number of parameters
                     3) degree of freedom
                     4) SSE
                     5) RMSE
                     6) AIC
                     7) Critical t value
                     8) Predicted Value of Y
                     Create a table to hold these values
            2. self.parameterOutput
                     1) self.parameterOutput generate a Python list containing 6 array:
                     2) self.p: estimated parameters (maxY, initalY,rate, lag)
                     3) self.SE: standard error for each parameter
                     4) self.t: t-value for each parameter
                     5) self.pval: p value for each parameter
                     6) self.PLCL95: lower 95% confience limit
                     7) self.PUCL95: upper 95% confidence limit
                     Sample
                     Parameters	Value	Std-Error	t-value	p-value	L95CI	U95CI
                     Y0 	 4.496 	 0.251 	 17.898 	 3.803E-04 	 3.696 	 5.295
                     Lag 	 1.127 	 0.205 	 5.507 	 1.179E-02 	 0.476 	 1.778
                     Ymax 	 14.046 	 0.288 	 48.759 	 1.900E-05 	 13.130 	 14.963
                     mumax 	 2.551 	 0.193 	 13.184 	 9.429E-04 	 1.935 	 3.166

            format parameterOutput:
                estimated value, standard error, t value, p value, lower CL, upper CL
                if > 0, formate to 0.00 (2 decimal points)
                if < 0, format to 1.00E+xx (2 decimal points with engineering expression)
            """
            self.jacob = JA.Jacobian(self.calculation.pOut, rawdata[0])
            self.confidenceIntervals = CI.ConfidenceIntervals(self.errorEstimate.MSE, self.jacob.jacob, self.calculation.YPredictedValue, self.errorEstimate.t_critical)
            print self.confidenceIntervals.CIOutputs
            
            """
            This section contains information of predicted values of Y
            self.CIOutputs = [self.L95MCI, self.U95MCI, self.L95PCI, self.U95PCI] 
            self.L95MCI: lower 95% confidence interval
            self.U95MCI: lower 95% confidence interval
            self.L95PCI: lower 95% prediction interval
            self.U95PCI: upper 95% prediction interval
            
            Format data to
            Pred: Predicted value, which is self.calculation.YPredictedValue
            data output report
            x	      y	  Pred	L95MCI	U95MCI	L95PCI	U95PCI
            0.00	2.00	  1.95	1.39	      2.51	1.10       2.80
            1.00	2.00	  2.11	1.69	      2.53	1.35	      2.87
            2.00	3.00	  2.88	2.36	      3.40	2.06	      3.69
            3.00	4.00  4.07	3.63       4.52	3.30	       4.84
            4.00	5.00	  5.10	4.66	      5.55	4.33	      5.88
            5.00	6.00	  5.76	5.39	      6.14	5.03      6.50
            6.00	6.00	  6.12	5.58	      6.67	5.29	      6.96
            
            
            """
        
            """
            The program has been tested, and identical to original product
            """
        else:
            pass

        #print "P output = ", self.calculation.pOut
        
        
        
        
def main():
    def generatefunc(Y0, Ymax, mumax, Lag, t):    # this generates a Gompertz function
        
        return  Y0 + (Ymax-Y0)*np.exp(-np.exp(-((x - Lag)*mumax*np.exp(1.)/(Ymax-Y0) - 1.)))
    # generate an x array or list   
    #x = np.array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15])
    x = np.array([0, 1, 2, 3, 4, 5, 6])
    y = np.array([2, 2, 3, 4, 5, 6, 6])
    # generate a x, y value
    #y = generatefunc(2.0, 8.5, 2.5, 5.0, x) + np.random.normal(0, 0.5, size=len(x)) #Refer [2]


    rawdata = [x, y]
    p0 = [1.0, 1.5]
    model = "Gompertz"
    calculation = dataAnalysis(rawdata, p0, model)


if __name__ == '__main__':
    main()        

