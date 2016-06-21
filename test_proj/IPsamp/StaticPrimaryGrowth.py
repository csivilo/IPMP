"""
Created for use in USDA Modeling tool IPMP

Author: Carlo Sivilotti
Date: 6/20/16
"""

import numpy


def getY(nO,nmax,rate,time,m):
        return nO + (nmax-nO)*numpy.exp(-1*(numpy.exp(-(rate)*(time-m))))
                  
