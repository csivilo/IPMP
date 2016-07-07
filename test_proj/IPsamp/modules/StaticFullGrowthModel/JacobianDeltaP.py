# -*- coding: utf-8 -*-
"""
Created on Sat Jun 25 19:10:31 2016

@author: Lihan_Huang
"""


import numpy as np
#from Gompertz import Gompertz

class JacobianDeltaP():
    def __init__(self, p, n):
         
        """
        p is the parameters of curve-fitting
        n is the number of x
        """
        pNumber = len(p)            
        self.dp = []         # delta p
        for i in range(len(p)):
            self.dp.append(p[i]*1.0e-8)      
        P = []
        f = []
        for i in range(pNumber):
            P.append([])
           
            for j in range(pNumber):                 
                P[i].append(0.0)
                
        for i in range(n):        
            f.append([])
            for j in range(pNumber):
                f[i].append(0.0)
                
         
        
       
        for j in range(pNumber):
            for k in range(pNumber):
                if k == j:
                    P[j][k] = p[k] + self.dp[k]
                else:
                    P[j][k] = p[k]                
        
        self.jacobianDeltaP = P
        #print "Jacobian Delta P = ", P
       
        
        

def main():   
    p = [8.0, 2.0, 2.0, 5.0]
    n = 10
   
    
    erroest = JacobianDeltaP(p, n)


if __name__ == '__main__':
    main()                 