# -*- coding: utf-8 -*-
"""
Created on Fri Mar 08 22:30:34 2013

@author: Lihan_Huang
"""
import warnings
import sys
import numpy as np
from scipy.optimize import  leastsq
import jacobian as JP
import JacobianDeltaP as JDP

class FitHuangFull:
    def __init__(self, rawdata, p0):
        # raw data contain x, y data set
        # initP: initial values of parameters
        # xp is the x for prediced values
        np.seterr(all='ignore')
        self.x = np.array(rawdata[0])
        self.y = np.array(rawdata[1])
        self.p0 = np.array(p0)
        self.initalY = np.min( np.array(rawdata[1]))
        self.maxY = np.max( np.array(rawdata[1]))
        self.dataLength = len(self.x)
        #print 'Report of Data Analysis'
        #print [self.x, self.y]
        p =[self.maxY, self.initalY, self.p0[0], self.p0[1]]
        self.pNumber = len(p)
        p,cov_x,infodict,mesg,ier = leastsq(self.YDiff,p,full_output=True)
        
        
        print 'p out =', p
        self.pOut = p
        self.cov = cov_x
        self.infodict = infodict
        self.mesg = mesg
        self.ier = ier
        #print "ier = ", self.ier
        #print self.YDiff(p)
        self.residual = self.infodict["fvec"]  #self.YDiff(p)
        print "Error message ", self.mesg
        print "IER = ", self.ier
        #print "residual of curve-fitting = ", self.residual
        self.YPredictedValue = self.HuangFullModelfunc(p[0], p[1], p[2], p[3], self.x)
        
        # The following calculated Jacobian delta
        self.JDP = JDP.JacobianDeltaP(p, self.dataLength)
        
        # The following generates Jacobian matrix
        M = []
        for i in range(self.dataLength):
            M.append([])
            for j in range(self.pNumber):
                M[i].append(0.0)
        
        for i in range(self.dataLength):
            for j in range(self.pNumber):
                
                M[i][j] = (self.HuangFullModelfunc(self.JDP.jacobianDeltaP[j][0], self.JDP.jacobianDeltaP[j][1], \
                self.JDP.jacobianDeltaP[j][2], self.JDP.jacobianDeltaP[j][3], self.x[i]) - \
                self.HuangFullModelfunc(p[0], p[1], p[2], p[3], self.x[i]))/self.JDP.dp[j]
        
        #print "M Jacobian matrix = ", M
        # Error Handling
        self.errorMessage = "Successful"
        try:
            self.jacobian = JP.Jacobian(M, self.dataLength)
        except np.linalg.linalg.LinAlgError as e:
            self.errorMessage = e
        print "error message = ", self.errorMessage
        
        """
        If self.message = None, successful
        if not, print "Not Successful"
        """
        
        
    """    
    def HuangFullModelfunc(self, Ymax, Y0, mumax, Lag, x):    # x is x data
        b = x + 0.25*np.log(1 + np.exp(-4.0*(x-Lag))) - 0.25*np.log(1+np.exp(4.0*Lag))        
        return  Y0 + Ymax -np.log(np.exp(Y0) + (np.exp(Ymax)-np.exp(Y0))*np.exp(-mumax*b))
    """
    e = ""
    def HuangFullModelfunc(self, Ymax, Y0, mumax, Lag, x):    # x is x data
        with warnings.catch_warnings():
            warnings.filterwarnings('error')
        try:
            b = x + 0.25*np.log(1 + np.exp(-4.0*(x-Lag))) - 0.25*np.log(1+np.exp(4.0*Lag))        
            y = Y0 + Ymax -np.log(np.exp(Y0) + (np.exp(Ymax)-np.exp(Y0))*np.exp(-mumax*b))
        except Warning as e:
            print('error found:', e)
            
        
        return  y
    
    def YDiff(self, p):
        Y_calculate = self.HuangFullModelfunc(p[0], p[1], p[2], p[3], self.x)
        return self.y- Y_calculate
    



def main():
    def generatefunc(Ymax, Y0, mumax, Lag, t):    # this generates a Gompertz function
        b = x + 0.25*np.log(1.0 + np.exp(-4.0*(x-Lag))) - 0.25*np.log(1+np.exp(4.0*Lag))
        return  Y0 + Ymax -np.log(np.exp(Y0) + (np.exp(Ymax)-np.exp(Y0))*np.exp(-mumax*b))
    # generate an x array or list   
    #x = np.array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15])
    # generate a x, y value
    #y = 2.303*(generatefunc(8.5, 2.0, 2.5, 5.0, x) + np.random.normal(0, 0.5, size=len(x))) #Refer [2]
    x = np.array([0, 1, 2, 3, 4, 5, 6])
    y = 2.303*np.array([2, 2, 3, 4, 5, 6, 6])

    rawdata = [x, y]
    p0 = [1.0, 3.5]
    calculation = FitHuangFull(rawdata, p0)





if __name__ == '__main__':
    main()        