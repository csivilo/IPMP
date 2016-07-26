# -*- coding: utf-8 -*-
"""
Created on Fri Mar 08 22:30:34 2013

@author: Lihan_Huang
"""
#import sys
import numpy as np
from scipy.optimize import  leastsq
#import jacobian as JP
import JacobianDeltaP as JDP

class FitRatkowskySubTemp:
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
        p =[self.p0[0], self.p0[1]]
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
        self.YPredictedValue = self.RatkowskySubTempModelfunc(p[0], p[1], self.x)
        self.Xplot = np.linspace(p[0], np.max(self.x)*1.05, 501)
        self.Yplot = self.RatkowskySubTempModelfunc(p[0], p[1], self.Xplot)
        
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
                self.RatkowskySubTempModelfunc(self.JDP.jacobianDeltaP[j][0],\
                self.JDP.jacobianDeltaP[j][1], self.x[i]) - \
                self.RatkowskySubTempModelfunc(p[0], p[1], self.x[i]))/self.JDP.dp[j]
        
        
        
           
        
        
    def RatkowskySubTempModelfunc(self, T0, a, x):    # x is x data
        
        return  a*(x - T0)
        

        
    def YDiff(self, p):
        Y_calculate = self.RatkowskySubTempModelfunc(p[0], p[1], self.x)
        return self.y- Y_calculate
    

def main():
    # generate an x array or list   
    x = np.array([5., 8., 10., 15., 20., 25., 30., 35.])
    # generate a x, y value
    y =np.array([0.06, 0.38, 0.42, 0.89, 1.2, 1.58, 1.96, 2.58])

    rawdata = [x, y]
    p0 = [1.5, 1.5] #p0[0] is rate, p0[1] is lag
    calculation = FitRatkowskySubTemp(rawdata, p0)


if __name__ == '__main__':
    main()        