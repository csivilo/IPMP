# -*- coding: utf-8 -*-
"""
Created on Sat Jun 25 19:10:31 2016

@author: Lihan_Huang
"""

from scipy import stats
import numpy as np

class errorEstimate():
     def __init__(self, x, p, cov, residual, predictedValue):
         self.dataLength = len(x)   # number of data input in x
         #print self.dataLength
         self.p = p
         #print "Error Estimate p ", p
         self.pNumber = len(p)      # number of parameter
         self.df = self.dataLength - self.pNumber            # df = degree of freedom
         #print "degree of freedom = ", self.df
         self.cov = cov
         self.residual = residual
         #print "residual Y = ", residual
         self.predictedValue = predictedValue
         self.SES = [ ]    # error square
         
         for i in range(self.dataLength):
             self.SES.append(self.residual[i]*self.residual[i])
         
         #print "SES = ", self.SES
         self.SSE = np.sum(self.SES)     # sum of error square
         print "SSE = ", self.SSE
         self.MSE = self.SSE/self.df    # mean of SSE
         self.RMSE =np.sqrt(self.MSE)   # Root of MSE
         self.residErr_std = np.std(self.residual)
         if self.df > 2:
            self.AIC = self.dataLength*np.log(self.SSE/self.dataLength) + 2.*(self.pNumber + 1.)\
            + 2.*(self.pNumber + 1)*(self.pNumber + 2.)/(self.df-2.)
            
         else:
            self.AIC = 'Not calculated'
         #print "AIC = ", self.AIC 
         
         variance = np.diagonal(self.cov)
         
         # calculate estimates of each parameter
         self.SE = np.sqrt(variance) #Refer [4]
         self.t = self.p/self.SE                # parameter t-value
         self.pvalue = stats.t.sf(np.abs(self.t), self.df)*2.
         #print "pval = ", self.pvalue
         # critical t-value, upper 95%
         self.t_critical = stats.t.isf(0.025, self.df)     # 95% confidence
         
         
         
         
         self.modelAnalysisOutput = [self.dataLength, self.pNumber, self.df, self.SSE, \
         self.RMSE, self.residErr_std, self.AIC, self.t_critical]
         """
         self.modelAnalysisOutput includes:
         1) number of data points
         2) number of parameters
         3) degree of freedom
         4) SSE
         5) RMSE
         6) AIC
         7) Critical t value
         
         """
         # parameter upper and lower 95% confidence interval
         self.PUCL95 = self.p + self.SE*self.t_critical      # parameter upper 95% confidence interval 
         self.PLCL95 = self.p - self.SE*self.t_critical      # parameter lower 95% confidence interval 
         
         
         
         self.parameterOutput = [self.p, self.SE, self.t, self.pvalue, self.PLCL95, self.PUCL95]
         
         """
         self.parameterOutput generate a Python list containing 6 array:
         self.p: estimated parameters (initalY, maxY, rate, lag)
         self.SE: standard error for each parameter
         self.t: t value for each parameter
         self.pval: p value for each parameter
         self.PLCL95: lower 95% confience limit
         self.PUCL95: upper 95% confidence limit
         
         
         """
         print "parameter output ", self.parameterOutput

def main():
    x = [1.0, 2.0, 3.0, 5.0]
    p = [2.0, 3.0, 4.0]
    cov = [6.0, 3.0, 3., 4.]
    residual= [0.0, 0.1, 0.2, 0.3]
    erroest = errorEstimate(x, p, cov, residual)


if __name__ == '__main__':
    main()                 