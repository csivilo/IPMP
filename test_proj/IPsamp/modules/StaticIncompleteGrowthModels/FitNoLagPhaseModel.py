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

class FitNoLagPhase:
    def __init__(self, rawdata, p0):
        print rawdata,p0
        # raw data contain x, y data set
        # initP: initial values of parameters
        # xp is the x for prediced values
        np.seterr(all='ignore')
        self.x = np.array(rawdata[0])
        self.y = np.array(rawdata[1])
        self.p0 = np.array(p0)
        self.initalY = np.min( np.array(rawdata[1]))
        self.Ymax = np.max( np.array(rawdata[1]))
        self.dataLength = len(self.x)
        #print 'Report of Data Analysis'
        #print [self.x, self.y]
        p =[self.Ymax, self.initalY, self.p0[0]]
        self.pNumber = len(p)
        p,cov_x,infodict,mesg,ier = leastsq(self.YDiff,p,full_output=True)
        
        
        #
        self.pOut = p
        self.cov = cov_x
        self.infodict = infodict
        self.mesg = mesg
        print p
        self.ier = ier
        #print "ier = ", self.ier
        #print self.YDiff(p)
        self.residual = self.infodict["fvec"]  #self.YDiff(p)
        #print "residual of curve-fitting = ", self.residual
        self.YPredictedValue = self.NoLagPhaseModelfunc(p[0], p[1], p[2], self.x)
        
        
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
                
                self.JacobianMatrix[i][j] = (self.NoLagPhaseModelfunc(self.JDP.jacobianDeltaP[j][0],\
                self.JDP.jacobianDeltaP[j][1], \
                self.JDP.jacobianDeltaP[j][2], self.x[i]) - \
                self.NoLagPhaseModelfunc(p[0], p[1], p[2], self.x[i]))/self.JDP.dp[j]
        
        
        
           
        
        
    def NoLagPhaseModelfunc(self, Ymax, Y0, mumax, x):    # x is x data   
               
        return  Ymax + mumax*x - np.log(np.exp(mumax*x) + np.exp(Ymax-Y0) - 1.)
        

        
    def YDiff(self, p):
        Y_calculate = self.NoLagPhaseModelfunc(p[0], p[1], p[2], self.x)
        return self.y- Y_calculate
    

def main():
    # generate an x array or list   
    x = np.array([0., 1., 2., 3., 4., 5., 6.])
    # generate a x, y value
    y = 2.303*np.array([1., 2., 3., 4., 5., 6., 6.])

    rawdata = [x, y]
    p0 = [1.5] #p0[0] is rate, p0[1] is lag
    calculation = FitNoLagPhase(rawdata, p0)


if __name__ == '__main__':
    main()        