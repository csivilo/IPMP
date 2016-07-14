# -*- coding: utf-8 -*-
"""
Created on Fri Mar 08 22:30:34 2013

@author: Lihan_Huang
"""
import numpy as np



class ReducedHuangModelFunc():
    def __init__(self,  Y0, mumax, lag, x):
            # x is x data
        
               
        self.ReducedHuang  = Y0 + mumax*(x + 0.25*np.log((1. + np.exp(-4.*(x-lag)))/(1. + np.exp(4.*lag))))
        



def main():
    Y0 = 2.0*2.303
    Ymax = 8.5*2.303
    mumax = 2.0
    lag = 2.0
    # generate an x array or list   
    x = np.array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15])
    
    ReducedHuangModel = ReducedHuangModelFunc(Y0,  mumax, lag, x)


if __name__ == '__main__':
    main()        