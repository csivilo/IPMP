# -*- coding: utf-8 -*-
"""
Created on Sun Jun 26 09:58:30 2016

@author: Lihan_Huang
"""
import numpy as np

class ConfidenceIntervals:
    def __init__(self, MSE, jacob, y, tValue):      # hi and y must be the same size
        self.MSE = MSE
        self.jacob = jacob
        self.y = y
        self.t_critical = tValue
        self.n = len(self.y)
        
        #CLM = np.sqrt(self.MSE*hi)*self.t_critical
        CLM = []
        CLP = []
        for i in range(self.n):
            clm = np.sqrt(self.MSE*self.jacob[i])*self.t_critical # model confidence interval
            CLM.append(clm)
            clp = np.sqrt(self.MSE*(self.jacob[i]+1.0))*self.t_critical # prediction confidence interval
            CLP.append(clp)
        
        self.L95MCI = []
        self.U95MCI = []
        self.L95PCI = []
        self.U95PCI = []
        for i in range(self.n):
            self.L95MCI.append(self.y[i] - CLM[i])
            self.U95MCI.append(self.y[i] + CLM[i])
            self.L95PCI.append(self.y[i] - CLP[i])
            self.U95PCI.append(self.y[i] + CLP[i])
        
        self.CIOutputs = [self.L95MCI, self.U95MCI, self.L95PCI, self.U95PCI]       
        
def main():
    MSE = 1.
    jacob = [1., 2., 3., 4]
    y = [1., 2., 3., 4.]
    tValue = 1.
    
   
    
    CIs =  ConfidenceIntervals(MSE, jacob, y, tValue)


if __name__ == '__main__':
    main()                             