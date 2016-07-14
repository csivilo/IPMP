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
    if analysisObj.modelName == "Baranyi":
        params[3] = "H0"
    if analysisObj.errorMessage != "successful":
        return ""
    text ="Developed by Dr. Lihan Huang, USDA Agricultural Research Service\n"

    datestr = str(datetime.datetime.now())
    text += "Current time: %s\n\n" % (datestr[:19])
    text += "Raw data:\nx%8s\n" % "y"
    for i in range(len(analysisObj.rawdata[0])):
        text +="%.2f    %.2f\n"%(analysisObj.rawdata[0][i],analysisObj.rawdata[1][i])

    text += "\nReport of Data Analysis - Modified %s Growth Model\n" % \
                             analysisObj.modelName
    text += "Data regression %s\n\n" % (analysisObj.errorMessage)
    text += 'Number of data points    %i\n' % analysisObj.errorEstimate.modelAnalysisOutput[0]
    text += "Number of parameters     %i\n" % analysisObj.errorEstimate.modelAnalysisOutput[1]
    text += "Degrees of freedom       %i\n" % analysisObj.errorEstimate.modelAnalysisOutput[2]
    text += 'SSE                      {0:.3f}\n'.format(analysisObj.errorEstimate.modelAnalysisOutput[3])
    text += 'RMSE                     {0:.3f}\n'.format(analysisObj.errorEstimate.modelAnalysisOutput[4])
    text += 'Residual std dev         {0:.3f}\n'.format(analysisObj.errorEstimate.modelAnalysisOutput[5])
    text += ('AIC                      %s\n' % (str(analysisObj.errorEstimate.modelAnalysisOutput[6]))[0:2])
    text += 'Critical t value         {0:.3f}\n\n'.format(analysisObj.errorEstimate.modelAnalysisOutput[7])
    text += "Parameter  Value  Std-Error  t-value  p-value  L95CI  U95CI\n"
    for i in range(len(analysisObj.parametersList)):
        text += "%-5s%10.2f %7.3f %10.3f %8.3f %8.3f %8.3f\n" % (analysisObj.parametersList[i], \
                                                                 analysisObj.errorEstimate.parameterOutput[0][i], \
            analysisObj.errorEstimate.parameterOutput[1][i],analysisObj.errorEstimate.parameterOutput[2][i], \
            analysisObj.errorEstimate.parameterOutput[3][i],analysisObj.errorEstimate.parameterOutput[4][i], \
                                                      analysisObj.errorEstimate.parameterOutput[5][i],)
    print text

    return text