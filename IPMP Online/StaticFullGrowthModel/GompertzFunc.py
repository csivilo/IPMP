# -*- coding: utf-8 -*-
"""
Created on Fri Mar 08 22:30:34 2013

@author: Lihan_Huang
"""
import numpy as np



class GompertzModelFunc():
    def __init__(self, Ymax, Y0, mumax, Lag, x):
        
        
        self.Gompertz = Y0 + (Ymax-Y0)*np.exp(-np.exp(-((x - Lag)*mumax*np.exp(1)/(Ymax-Y0) - 1.0)))
        print x, self.Gompertz


def main():
    Y0 = 2.0
    Ymax = 8.5
    mumax = 2.0
    Lag = 5.0
    # generate an x array or list   
    x = np.array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15])
    
    GompertzModel = GompertzModelFunc(Ymax, Y0,  mumax, Lag, x)


if __name__ == '__main__':
    main()        