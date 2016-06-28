# -*- coding: utf-8 -*-
"""
Created on Fri Mar 08 22:30:34 2013

@author: Lihan_Huang
"""
import numpy as np



class HuangFullModelFunc():
    def __init__(self, Ymax, Y0, mumax, Lag, x):
        b = x + 0.25*np.log(1 + np.exp(-4.0*(x-Lag))) - 0.25*np.log(1+np.exp(4.0*Lag))
        self.HuangFull = Y0 + Ymax -np.log(np.exp(Y0) + (np.exp(Ymax)-np.exp(Y0))*np.exp(-mumax*b))
        print x, self.HuangFull


def main():
    Y0 = 2.0*2.303
    Ymax = 8.5*2.303
    mumax = 2.0
    Lag = 5.0
    # generate an x array or list   
    x = np.array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15])
    
    HuangFullModel = HuangFullModelFunc(Ymax, Y0,  mumax, Lag, x)


if __name__ == '__main__':
    main()        