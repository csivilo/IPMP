# -*- coding: utf-8 -*-
"""
Created on Fri Mar 08 22:30:34 2013

@author: Lihan_Huang
"""
import numpy as np



class TwoPhaseBuchananModelFunc():
    def __init__(self,  Ymax, Y0, mumax, x):    # x is x data   
               
        self.NoLagPhase =  Ymax + mumax*x - np.log(np.exp(mumax*x) + np.exp(Ymax-Y0) - 1.)
          
        



def main():
    Y0 = 2.0*2.303
    Ymax = 8.5*2.303
    mumax = 2.0
    lag = 2.0
    # generate an x array or list   
    x = np.array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15])
    
    TwoPhaseBuchananModel = TwoPhaseBuchananModelFunc(Ymax, Y0,  mumax,  x)


if __name__ == '__main__':
    main()        