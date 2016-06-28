# -*- coding: utf-8 -*-
"""
Created on Sat Jun 25 19:10:31 2016

@author: Lihan_Huang
"""


import numpy as np
#from Gompertz import Gompertz

class Jacobian():
    def __init__(self, m, n):
        """
        m is the jacobian matrix
        """
      
        jacb = np.array(m)  # numerical Jacobian successful
    
        jT = jacb.T     # Transpose of Jacobian
        #print 'Transpose of Jacobian'
        #print jT
        JX = np.dot(jT, jacb)
        #print 'XTX'
        #print JX
        JXINV = np.linalg.inv(JX)
        #print 'JXINV'
        #print JXINV
        self.jacob = []
        for i in range(n):
            h =np.dot(jacb[i, :], JXINV)
            h = np.dot(h, jacb[i, :].T)
            self.jacob.append(h)
        print "New Jacobian ", self.jacob
        

def main():
    m=np.array([[1, 2, 3], [2, 3, 4], [5, 6, 7]])   
    n = 2
    erroest = Jacobian(m, n)


if __name__ == '__main__':
    main()                 