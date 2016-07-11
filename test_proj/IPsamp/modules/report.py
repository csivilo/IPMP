"""
Contains functions for creating model specific reports for the IPMP modeling
suite

Author: Carlo Sivilotti
Date: 7/11/16
"""

import datetime
"""
function report takes a dataAnalysis oject from any of the IPMP module wrappers and creates a string cointaining all
pertinent report information
"""
def report(analysisObj):
    params = ['Ymax', 'Y0', 'mumax', 'Lag']


    if analysisObj.errorMessage != "successful":
        return ""
    text ="Developed by Dr. Lihan Huang, USDA Agricultural Research Service\n"
    text += "Current time: %s\n\n" % (datetime.datetime.now())
    text += "Raw data:\nx%8s\n" % "y"
    for i in range(len(analysisObj.rawdata[0])):
        text +="%.2f\t%.2f\n"%(analysisObj.rawdata[0][i],analysisObj.rawdata[1][i])

    text += "\nReport of Data Analysis - Modified %s Growth Model\n" % \
                             analysisObj.modelName
    text += "Data regression %s\n\n" % (analysisObj.errorMessage)
    text += 'Degree of data points\t%i\n' % analysisObj.errorEstimate.modelAnalysisOutput[0]
    text += "Number of parameters\t%i\n" % analysisObj.errorEstimate.modelAnalysisOutput[1]
    text += "Degree of freedom\t\t%i\n" % analysisObj.errorEstimate.modelAnalysisOutput[2]
    text += 'SSE\t\t\t\t\t\t{0:.3f}\n'.format(analysisObj.errorEstimate.modelAnalysisOutput[3])
    text += 'RMSE\t\t\t\t\t{0:.3f}\n'.format(analysisObj.errorEstimate.modelAnalysisOutput[4])
    text += 'Residual std dev\t\t{0:.3f}\n'.format(analysisObj.errorEstimate.modelAnalysisOutput[5])
    text += 'AIC\t\t\t\t\t\t{0:3s}\n'.format(analysisObj.errorEstimate.modelAnalysisOutput[6])
    text += 'Critical t value\t\t{0:.3f}\n\n'.format(analysisObj.errorEstimate.modelAnalysisOutput[7])
    text += "Parameter  Value  Std-Error  t-value  p-value  L95CI  U95CI\n"
    for i in range(4):
        text += "%-5s%10.2f %7.3f %10.3f %8.3f %8.3f %8.3f\n" % (params[i],analysisObj.errorEstimate.parameterOutput[0][i], \
            analysisObj.errorEstimate.parameterOutput[1][i],analysisObj.errorEstimate.parameterOutput[2][i], \
            analysisObj.errorEstimate.parameterOutput[3][i],analysisObj.errorEstimate.parameterOutput[4][i], \
                                                      analysisObj.errorEstimate.parameterOutput[5][i],)



    print text
    return text