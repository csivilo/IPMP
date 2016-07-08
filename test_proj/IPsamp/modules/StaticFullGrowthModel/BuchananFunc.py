# -*- coding: utf-8 -*-
"""
Created on Fri Mar 08 22:30:34 2013

@author: Lihan_Huang
"""
import numpy as np



class BuchananModelFunc():
    def __init__(self, Ymax, Y0, mumax, lag, x):
            # x is x data      
             
        a1 = np.piecewise(x, [x < lag, x >= lag], [0.0, 1.0])
        tc = (Ymax-Y0)/mumax+lag
        a2 = np.piecewise(x, [x < tc, x >= tc], [0.0, 1.0])
        self.Buchanan = Y0*(1.0-a1)+(Y0 + mumax*(x-lag))*a1*(1.0-a2) +  Ymax*a2
        
        print x, self.Buchanan


def main():
    Y0 = 2.0*2.303
    Ymax = 8.5*2.303
    mumax = 2.0
    lag = 2.0
    # generate an x array or list   
    x = np.array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15])
    
    BuchananModel = BuchananModelFunc(Ymax, Y0,  mumax, lag, x)


if __name__ == '__main__':
    main()        