# -*- coding: utf-8 -*-
"""
Created on Fri Mar 08 22:30:34 2013

@author: Lihan_Arrhenius
"""
#import sys
import numpy as np
from scipy.optimize import  leastsq
#import jacobian as JP
import JacobianDeltaP as JDP

class FitArrheniusSubOptimal:
    def __init__(self, rawdata, p0):
        # raw data contain x, y data set
        # initP: initial values of parameters
        # xp is the x for prediced values
        np.seterr(all='ignore')
        self.x = np.array(rawdata[0])
        self.y = np.array(rawdata[1])
        self.p0 = np.array(p0)   # Rate and Shoulder
        
        #self.YTail = np.min( np.array(rawdata[1]))
        self.dataLength = len(self.x)
        #print 'Report of Data Analysis'
        #print [self.x, self.y]
        p =[self.p0[0], self.p0[1], self.p0[2]]
        self.pNumber = len(p)
        p,cov_x,infodict,mesg,ier = leastsq(self.YDiff,p,full_output=True)
        
        

        self.pOut = p
        self.cov = cov_x
        self.infodict = infodict
        self.mesg = mesg
        self.ier = ier
        #print "ier = ", self.ier
        #print self.YDiff(p)
        self.residual = self.infodict["fvec"]  #self.YDiff(p)
        #print "residual of curve-fitting = ", self.residual
        self.YPredictedValue = self.ArrheniusSubTempModelfunc(p[0], p[1], p[2], self.x)
        self.Xplot = np.linspace(p[0], np.max(self.x)*1.05, 501)
        self.Yplot = self.ArrheniusSubTempModelfunc(p[0], p[1], p[2], self.Xplot)
        #print self.Xplot, self.Yplot
        
        
        # The following calculated Jacobian delta
        self.JDP = JDP.JacobianDeltaP(p, self.dataLength)
        
        # The following generates Jacobian matrix
        self.JacobianMatrix = []
        for i in range(self.dataLength):
            self.JacobianMatrix.append([])
            for j in range(self.pNumber):
                self.JacobianMatrix[i].append(0.0)
        
        for i in range(self.dataLength):
            for j in range(self.pNumber):
                
                self.JacobianMatrix[i][j] = (\
                self.ArrheniusSubTempModelfunc(self.JDP.jacobianDeltaP[j][0],\
                self.JDP.jacobianDeltaP[j][1], self.JDP.jacobianDeltaP[j][2], self.x[i]) - \
                self.ArrheniusSubTempModelfunc(p[0], p[1], p[2], self.x[i]))/self.JDP.dp[j]
        
        
        
           
        
        
    def ArrheniusSubTempModelfunc(self, Ea, alpha, A, x):
        m = np.power((Ea/(x + 273.15)/8.314), alpha)
        
        return A*(x + 273.15)*np.exp(-m)
        

        
    def YDiff(self, p):
        Y_calculate = self.ArrheniusSubTempModelfunc(p[0], p[1], p[2], self.x)
        return self.y- Y_calculate
    

def main():
    # generate an x array or list   
    x = np.array([0., 5., 10., 15., 20., 25., 30., 35.])
    # generate a x, y value
    y =np.array([0.03, 0.02, 0.15, 0.46, 1.26, 2.27, 3.47, 4.5])
    # generate a x, y value
    #y = generatefunc(2.0, 8.5, 2.5, 5.0, x) + np.random.normal(0, 0.5, size=len(x)) #Refer [2]


    rawdata = [x, y]
    p0 = [2600, 15., 0.1]
    calculation = FitArrheniusSubOptimal(rawdata, p0)


if __name__ == '__main__':
    main()        