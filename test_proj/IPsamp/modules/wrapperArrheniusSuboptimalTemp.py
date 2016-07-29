# -*- coding: utf-8 -*-
"""
Created on Sat Jun 25 18:58:23 2016

@author: Lihan_Arrhenius
"""

import numpy as np
import SecondaryModels.FitArrheniusSubOptimalTempModel as RASUB
import ErrorAnalysis.errorEstimate as EA
import ErrorAnalysis.jacobian as JA
import ErrorAnalysis.calculateConfidenceIntervals as CI
class dataAnalysis():
    def __init__(self, rawdata, p0):
        self.rawdata = rawdata
        self.p = p0
        self.dataLength = len(rawdata[0])
        self.modelName = "Arrhenius Square-root Model (full range)"
        np.seterr(all='ignore')
        self.calculation = RASUB.FitArrheniusSubOptimal(rawdata, self.p)
        
        try:    
            self.errorEstimate = EA.errorEstimate(rawdata[0], self.calculation.pOut, \
                self.calculation.cov, self.calculation.residual, \
                self.calculation.YPredictedValue)        

        #except (ValueError,  OverflowError, ZeroDivisionError, FloatingPointError): 
        except:
            pass
        self.parametersList = ['Delta_G', 'n', 'a']
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
                 Y0 	 6.380E+00 	 3.058E-01 	 20.864 	 3.118E-05 	 5.531E+00 	 7.229E+00
                 D 	 5.346E-01 	 2.163E-01 	 2.471 	 6.884E-02 	 -6.598E-02 	 1.135E+00
                 alpha 	 1.319E+00 	 2.165E-01 	 6.091 	 3.673E-03 	 7.176E-01 	 1.920E+00

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

            self.outputXplot = self.calculation.Xplot
            self.outputYplot = self.calculation.Yplot
            #print self.outputXplot, self.outputYplot
            
        except:
            self.errorMessage = np.linalg.linalg.LinAlgError
        #print "error message = ", self.errorMessage
                
        
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
        data output report
        x	y	Pred	L95MCI	U95MCI	L95PCI	U95PCI
        0.00	6.20	6.38	5.53	7.23	5.10	7.66
        1.00	6.00	5.85	5.33	6.36	4.76	6.94
        2.00	5.20	5.05	4.52	5.58	3.95	6.14
        3.00	4.30	4.10	3.55	4.65	3.00	5.21
        4.00	2.80	3.05	2.56	3.55	1.97	4.13
        5.00	1.50	1.92	1.40	2.43	0.83	3.00
        6.00	1.05	0.70	-0.12	1.52	-0.56	1.96
        
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
    x = np.array([0., 5., 10., 15., 20., 25., 30., 35.])
    # generate a x, y value
    y =np.array([0.03, 0.02, 0.15, 0.46, 1.26, 2.27, 3.47, 4.5])
    # generate a x, y value
    #y = generatefunc(2.0, 8.5, 2.5, 5.0, x) + np.random.normal(0, 0.5, size=len(x)) #Refer [2]


    rawdata = [x, y]
    p0 = [2600, 15., 0.1]
    
    
    calculation = dataAnalysis(rawdata, p0)


if __name__ == '__main__':
    main()        

