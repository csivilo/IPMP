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
                  
