# -*- coding: utf-8 -*-
"""
Created on Fri Mar 08 22:30:34 2013

@author: Lihan_Cardinal
"""
#import sys
import numpy as np
from scipy.optimize import  leastsq
#import jacobian as JP
import JacobianDeltaP as JDP

class FitCardinalFullTemp:
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
        p =[self.p0[0], self.p0[1], self.p0[2], self.p0[3]]
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
        self.YPredictedValue = self.CardinalSubTempModelfunc(p[0], p[1], p[2], p[3], self.x)
        self.Xplot = np.linspace(p[0], p[2], 101)
        self.Yplot = self.CardinalSubTempModelfunc(p[0], p[1], p[2], p[3], self.Xplot)
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
                self.CardinalSubTempModelfunc(self.JDP.jacobianDeltaP[j][0],\
                self.JDP.jacobianDeltaP[j][1], self.JDP.jacobianDeltaP[j][2],\
                self.JDP.jacobianDeltaP[j][3],self.x[i]) - \
                self.CardinalSubTempModelfunc(p[0], p[1], p[2], p[3], self.x[i]))/self.JDP.dp[j]
        
        
        
           
        
        
    def CardinalSubTempModelfunc(self, Tmin, Topt, Tmax, mumax, x):       
        c = ((Topt - Tmin)*(x - Topt) - (Topt-Tmax)*(Topt+Tmin-2.*x))*(Topt - Tmin)
        
        return mumax*(x - Tmax)*(x - Tmin)**2.0/c
        

        
    def YDiff(self, p):
        Y_calculate = self.CardinalSubTempModelfunc(p[0], p[1], p[2], p[3], self.x)
        return self.y- Y_calculate
    

def main():
    # generate an x array or list   
    x = np.array([7., 10., 15., 20.,25., 30., 35., 37., 40.])
    # generate a x, y value
    y =np.array([0.11, 0.68, 1.23, 2.15, 2.44, 3.03, 3.48, 3.56, 2.09])

    rawdata = [x, y]
    p0 = [5.5, 35., 45., 2.0] #p0[0] is rate, p0[1] is lag
    calculation = FitCardinalFullTemp(rawdata, p0)


if __name__ == '__main__':
    main()        