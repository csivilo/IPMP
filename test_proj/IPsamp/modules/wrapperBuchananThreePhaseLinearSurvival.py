# -*- coding: utf-8 -*-
"""
Created on Sat Jun 25 18:58:23 2016

@author: Lihan_Huang
"""

import numpy as np
import SurvivalModels.FitBuchananThreePhaseLinearSurvivalModel as BTPL
import ErrorAnalysis.errorEstimate as EA
import ErrorAnalysis.jacobian as JA
import ErrorAnalysis.calculateConfidenceIntervals as CI
class dataAnalysis():
    def __init__(self, rawdata, p0):
        self.rawdata = rawdata
        self.p = p0
        self.dataLength = len(rawdata[0])
        self.modelName = "Buchanan Three-Phase Linear Survival Model"
        np.seterr(all='ignore')
        self.calculation = BTPL.FitBuchananThreePhaseLinearSurvival(rawdata, self.p)
        
        try:    
            self.errorEstimate = EA.errorEstimate(rawdata[0], self.calculation.pOut, \
                self.calculation.cov, self.calculation.residual, \
                self.calculation.YPredictedValue)
        #except (ValueError,  OverflowError, ZeroDivisionError, FloatingPointError): 
        except:
            pass
        self.parametersList = ['Y0', 'YTail', 'k', 'Shoulder']
        """
        The outputs from data analysis are included in two outfrom from the call to
        self.self.errorEstimate - self.errorEstimate produces two important outputs:
            1) self.errorEstimate.modelAnalysisOutput
            2) self.errorEstimate.parameterOutput
        
        1) The first part is related to model analysis - self.errorEstimate.modelAnalysisOutput 
        
        self.errorEstimate.modelAnalysisOutput = [self.dataLength, self.pNumber, self.df, self.SSE, \
        self.RMSE, self.residErr_std, self.AIC, self.t_critical]
        
        self.errorEstimate.modelAnalysisOutput - Output Annotation
        OUTPUTS FOR THIS SECTION
           0) number of data points - 'Degree of data points\t %i' % self.errorEstimate.modelAnalysisOutput[0]
           1) number of parameters -  "Number of parameers \t %i" % self.errorEstimate.modelAnalysisOutput[1]
           2) degree of freedom -      "Degree of freedom \t %i" % self.errorEstimate.modelAnalysisOutput[2]
           3) SSE                      'SSE\t\t {0:.3f}'.format(self.errorEstimate.modelAnalysisOutput[3]) '
           4) RMSE                    'RMSE\t\t {0:.3f}'.format(self.errorEstimate.modelAnalysisOutput[4]) '
           5) Residual standard deviation '  Residual standard deviation \t\t {0:.3f}'.format(self.errorEstimate.modelAnalysisOutput[5]) '  
           6) AIC                      'AIC (the smaller the better) \t\t {0:.3f}'.format(self.errorEstimate.modelAnalysisOutput[6]) '  
           7) Critical t value        "Critical t value \t\t {0:.3f}'.format(self.errorEstimate.modelAnalysisOutput[7]) '  
        
                 
        2) The second part is related to parameter analysis - self.errorEstimate.parameterOutput
        self.errorEstimate.parameterOutput is list containing 6 elements
        self.errorEstimateself.parameterOutput = [self.p, self.SE, self.t, self.pvalue, self.PLCL95, self.PUCL95]
        
        OUTPUTS FOR THIS SECTION
        
           0) Parameter estimates (maxY, initalY,rate, lag): self.errorEstimate.parameterOutputself[0]
           1) standard error for each parameter: self.errorEstimate.parameterOutput[1]
           2) t-value for each parameter:  self.errorEstimate.parameterOutput[2]       
           3) p value for each parameter:  self.errorEstimate.parameterOutput[3]
           4) lower 95% confience limit: self.errorEstimate.parameterOutput[4]
           5) upper 95% confidence limit: self.errorEstimate.parameterOutput[5]

            The outputs are listed as below 
                The first column = self.parametersList
                 
                 Parameters	Value	Std-Error	t-value	    p-value	     L95CI	U95CI
                 Y0 	 6.644 	 0.486 	 13.677 	1.655E-04 	 5.295 	 7.993
                 YTail 	 1.050 	 0.175 	 5.996 	    9.290E-03 	 0.493 	 1.607
                 k   	 1.224 	 0.073 	 16.677 	7.574E-05 	 1.020 	 1.427
                 Shoulder 	-0.062 	 0.500 	 -0.124 	 9.069E-01 	-1.451 	 1.326
                 

        Each value can be located from the output list.  For example
        4.496 = self.errorEstimate.parameterOutputself[0][0]

        format parameterOutput:
            estimated value, standard error, t value, p value, lower CL, upper CL
            if > 0, formate to 0.000 (3 decimal points)
            if < 0, format to 1.000E+xx (3 decimal points with engineering expression)
        """
        
        self.errorMessage = "successful"
        try: 
            self.jacobian = JA.Jacobian(self.calculation.JacobianMatrix, self.dataLength)
            self.confidenceIntervals = CI.ConfidenceIntervals(self.errorEstimate.MSE,  self.jacobian.jacob,\
            self.calculation.YPredictedValue, self.errorEstimate.t_critical)
        except:
            self.errorMessage =np.linalg.linalg.LinAlgError

                
        
        """
        Watch for "self.errorMessage" - 
        if "self.errorMessage" = "Successful":
            Continue generate output
        if else: "regression failed!"

        If no error, error message = "successful"
        the following output will be produced
        This section contains information of predicted values of Y
        self.confidenceIntervals.CIOutputs = [self.L95MCI, self.U95MCI, self.L95PCI, self.U95PCI] 
        self.L95MCI: lower 95% confidence interval
        self.U95MCI: lower 95% confidence interval
        self.L95PCI: lower 95% prediction interval
        self.U95PCI: upper 95% prediction interval
        
        Format data to
        Pred: Predicted value, which is self.calculation.YPredictedValue
        data output report

        OUTPUTS FOR THIS SECTION                
        Sample output
        x	      y	      Pred	L95MCI	    U95MCI	L95PCI	  U95PCI
        0.00	2.00	  1.95	1.39	      2.51	1.10       2.80
        1.00	2.00	  2.11	1.69	      2.53	1.35	   2.87
        2.00	3.00	  2.88	2.36	      3.40	2.06	   3.69
        3.00	4.00      4.07	3.63          4.52	3.30	   4.84
        4.00	5.00	  5.10	4.66	      5.55	4.33	   5.88
        5.00	6.00	  5.76	5.39	      6.14	5.03       6.50
        6.00	6.00	  6.12	5.58	      6.67	5.29	   6.96
        
        The first two columns are raw data - self.rawdata[0], self.rawdata[1]
        
        Pred = self.calculation.YPredictedValue
        L95MCI = self.confidenceIntervals.CIOutputs[0]
        self.U95MCI = self.confidenceIntervals.CIOutputs[1]
        L95PCI = self.confidenceIntervals.CIOutputs[2]
        U95PCI = self.confidenceIntervals.CIOutputs[3]
        
        
        If error, error message = "Singular matrix"
        No statistics will be produced.  Regression failed
        """
    
        """
        The program has been tested, and identical to original product
        """
    

    #print "P output = ", self.calculation.pOut
        


        
def main():
    
    # generate an x array or list   
    #x = np.array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15])
    x = np.array([0, 1, 2, 3, 4, 5, 6])
    y =np.array([6.2, 6.0, 5.2, 4.3, 2.8, 1.5, 1.05])
    # generate a x, y value
    #y = generatefunc(2.0, 8.5, 2.5, 5.0, x) + np.random.normal(0, 0.5, size=len(x)) #Refer [2]


    rawdata = [x, y]
    p0 = [1.0, 1.0]
    
    calculation = dataAnalysis(rawdata, p0)


if __name__ == '__main__':
    main()        

