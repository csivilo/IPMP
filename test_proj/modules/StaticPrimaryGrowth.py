"""
Created for use in USDA Modeling tool IPMP

Author: Carlo Sivilotti
Date: 6/20/16
"""

import numpy

class Gompertz:

	def __init__(self,nO,nmax,rate,m,time):
		self.nO = nO
		self.nmax = nmax
		self.rate = rate
		self.m = m
		self.time = time
		def getY(self):
			return self.nO + (self.nmax-self.nO)*numpy.exp(-1*(numpy.exp(-(self.rate)*(self.time-self.m))))
		def getTime(self):
			return self.time
		def setTime(self,newt):
			self.time = newt