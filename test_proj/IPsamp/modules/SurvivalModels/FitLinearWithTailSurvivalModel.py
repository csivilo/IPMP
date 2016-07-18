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

class FitLinearWithTailSurvival:
    def __init__(self, rawdata):
        # raw data contain x, y data set
        # initP: initial values of parameters
        # xp is the x for prediced values
        np.seterr(all='ignore')
        self.x = np.array(rawdata[0])
        self.y = np.array(rawdata[1])
        self.D = np.max(self.x)/(np.max(self.y)-np.min(self.y))
        self.initalY = np.max( np.array(rawdata[1]))
        self.YTail = np.min( np.array(rawdata[1]))
        self.dataLength = len(self.x)
        #print 'Report of Data Analysis'
        #print [self.x, self.y]
        p =[self.initalY, self.D, self.YTail]
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
        self.YPredictedValue = self.LinearWithTailSurvivalModelfunc(p[0], p[1], p[2], self.x)
        
        
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
                
                self.JacobianMatrix[i][j] = (self.LinearWithTailSurvivalModelfunc(self.JDP.jacobianDeltaP[j][0],\
                self.JDP.jacobianDeltaP[j][1], self.JDP.jacobianDeltaP[j][2],self.x[i]) - \
                self.LinearWithTailSurvivalModelfunc(p[0], p[1], p[2], self.x[i]))/self.JDP.dp[j]
        
        
        
           
        
        
    def LinearWithTailSurvivalModelfunc(self, Y0, D, YTail, x):    # x is x data                     
        
        a1 = np.piecewise(x, [x < D*(Y0-YTail), x >= D*(Y0-YTail)], [0, 1])
        
        return (Y0 - x/D)*(1-a1) + a1*YTail
        

        
    def YDiff(self, p):
        Y_calculate = self.LinearWithTailSurvivalModelfunc(p[0], p[1], p[2], self.x)
        return self.y- Y_calculate
    

def main():
    # generate an x array or list   
    x = np.array([0., 1., 2., 3., 4., 5., 6.])
    # generate a x, y value
    y =np.array([6.2, 5.2, 4.2, 3., 2., 1., 1.05])

    rawdata = [x, y]
    #p0 = [1.5] #p0[0] is rate, p0[1] is lag
    calculation = FitLinearWithTailSurvival(rawdata)


if __name__ == '__main__':
    main()        