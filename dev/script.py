#!/usr/bin/python3

import sys
import csv
import datetime
import collections
import pprint
import os
import json
import pandas as pd


dataDir ="ctsdata.jcu.edu.au/"
configDir="../config/"

def checkDate(inputDate):
    if inputDate == "":
        return False
    isValid= True;
    try:
        datetime.datetime.strptime( inputDate, "%Y-%m-%d %H:%M:%S" )
    except ValueError :
        isValid = False
    return isValid


with open(configDir+"config.json", encoding='UTF-8') as configFile:
    text = configFile.read()
    config = json.loads(text)
    jsonDates = config["dateRanges"]
    for item in jsonDates:
        subDir= item.get("dataDir")
        start = item.get("start")
        end= item.get("end")
        if not checkDate(start) :
            #print ("start is not valid")
            end = datetime.datetime.now()
            start = end - datetime.timedelta(days=3)
        elif not checkDate(end) :
            #print ("end is not valid")
            start=datetime.datetime.strptime(start, "%Y-%m-%d %H:%M:%S")
            end= start + datetime.timedelta(days=3)
        for filename in os.listdir(dataDir+subDir):
            try:
                with open(dataDir+subDir+filename) as csvfile:
                    if filename.endswith(".csv"):
                        readCSV = csv.reader(csvfile, delimiter=',')
                        result = collections.defaultdict(list)
                        for row in readCSV:
                            date = row[0]
                            if checkDate(date):
                                date=datetime.datetime.strptime( date, "%Y-%m-%d %H:%M:%S" )
                                if date>=start and date<=end :
                                    result['data'].append(row)
                            else :
                                result[date].append(row)

                        header=result.get('TIMESTAMP')
                        for i,j in result.items():
                            if i== "data":
                                fileDir= dataDir+subDir+"processed/"
                                filePath = dataDir+subDir+"processed/"+"%s.csv"%(filename[0]+filename[len(filename)-5])
                                if not os.path.exists(os.path.dirname(fileDir)):
                                    try:
                                        os.makedirs(os.path.dirname(fileDir))
                                    except OSError as exc: # Guard against race condition
                                        if exc.errno != errno.EEXIST:
                                            raise
                                with open(filePath, 'w') as fp:
                                    writer = csv.writer(fp, delimiter=',')
                                    writer.writerows(header) 
                                    writer.writerows(j)       
            except:
                pass
            
for x in range(1, 7):            
    df1 = pd.read_csv(dataDir+subDir+"processed/"+"w"+str(x)+".csv", index_col=0, names=['TIMESTAMP', 'RECORD', 'Kmh_Max3Sec', 'WS_kmh_3SecAvg_TMx', 'WindDir_3sec', 'Kmh_Mean', 'WindDir_MeanVect', 'Kmh_StDev'], parse_dates=True)

    df2 = pd.read_csv(dataDir+subDir+"processed/"+"t"+str(x)+".csv", index_col=0, names=['TIMESTAMP', 'RECORD', 'batt_volt_Min', 'LithBatt_Min', 'PTemp_Avg', 'AirTemp_Avg', 'AirTemp_Max', 'AirTemp_Min', 'RH_Avg', 'RH_Max', 'RH_Min', 'Pressure'], parse_dates=True)

    df1['Pressure'] = df2['Pressure']

    df1.to_csv(dataDir+subDir+"processed/"+"t"+str(x)+".csv", header=False)
                           
                            
                            
                            
                            
                            
                            
                            
