# -*- coding: utf-8 -*-
"""
Created on Fri Mar 08 22:30:34 2013

@author: Lihan_Huang
"""
import numpy as np



class ReducedBaranyiModelFunc():
    def __init__(self,  Y0, mumax, h0, x):
            # x is x data
        
               
        self.ReducedBaranyi  = Y0 + mumax*x + np.log(np.exp(-mumax*x) + np.exp(-h0) - np.exp(-mumax*x-h0))
        
        



def main():
    Y0 = 2.0*2.303
    Ymax = 8.5*2.303
    mumax = 2.0
    h0 = 2.0
    # generate an x array or list   
    x = np.array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15])
    
    BaranyiModel = ReducedBaranyiModelFunc(Y0,  mumax, h0, x)


if __name__ == '__main__':
    main()        