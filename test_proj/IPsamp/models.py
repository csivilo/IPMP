from __future__ import unicode_literals

from django.db import models

import numpy

class Gompertz(models.Model):
    nO = models.IntegerField()
    nmax = models.IntegerField()
    rate = models.IntegerField()
    m = models.IntegerField()
    time = models.IntegerField()

    def getY(self):
        return self.nO + (self.nmax-self.nO)*numpy.exp(-1*(numpy.exp(-(self.rate)*(self.time-self.m))))
                  
    def runSim(self,end_time,increments):
        lst = []
        current_time = self.time
        for i in range(1,increments+2):
            lst.append({"id": i+20, "time_input": self.time, "conc_input":self.getY()})
            self.time += ((end_time - float(current_time))/increments)
        self.time = current_time
        return lst
