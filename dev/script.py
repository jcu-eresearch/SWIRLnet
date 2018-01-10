#!/usr/bin/python3

import sys
import csv
import datetime
import collections
import pprint
import os
import json
import pandas as pd


dataDir ="/srv/SWIRLnet/data/"
configDir="/srv/SWIRLnet/config/"

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
        #print (item)
        subDir= item.get("dataDir")
        start = item.get("start")
        end= item.get("end")
        if not checkDate(start) :
            #print ("start is not valid")
            end = datetime.datetime.now()
            start = end - datetime.timedelta(days=3)
            #print(start)
            #print(end)
        elif not checkDate(end) :
            #print ("end is not valid")
            start=datetime.datetime.strptime(start, "%Y-%m-%d %H:%M:%S")
            end= start + datetime.timedelta(days=3)
            #print(start)
            #print(end)
        else :
            start=datetime.datetime.strptime(start, "%Y-%m-%d %H:%M:%S")
            end=datetime.datetime.strptime(end, "%Y-%m-%d %H:%M:%S")
        #print(dataDir+subDir)    
        for filename in os.listdir(dataDir+subDir):
            try:
                #print(dataDir+subDir+filename)
                with open(dataDir+subDir+filename) as csvfile:
                    if filename.endswith(".csv"):
                        #print(filename)
                        readCSV = csv.reader(csvfile, delimiter=',')
                        result = collections.defaultdict(list)
                        for row in readCSV:
                            date = row[0]
                            #print(date)
                            if checkDate(date):
                                date=datetime.datetime.strptime( date, "%Y-%m-%d %H:%M:%S" )
                                #print(date)
                                if date>=start and date<=end :
                                    result['data'].append(row)
                            else :
                                result[date].append(row)
                        #print(result['data'])        

                        header=result.get('TIMESTAMP')
                        for i,j in result.items():
                            if i== "data":
                                fileDir= dataDir+subDir+"processed/"
                                #rint(fileDir)
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
            except Exception as inst:
                 pass

#get the headings from the files
for x in range(1, 7):            
    df1 = pd.read_csv(dataDir+"old/"+"processed/"+"w"+str(x)+".csv", index_col=0, names=['TIMESTAMP', 'RECORD', 'Kmh_Max3Sec', 'WS_kmh_3SecAvg_TMx', 'WindDir_3sec', 'Kmh_Mean', 'WindDir_MeanVect', 'Kmh_StDev'], parse_dates=True)

    df2 = pd.read_csv(dataDir+"old/"+"processed/"+"t"+str(x)+".csv", index_col=0, names=['TIMESTAMP', 'RECORD', 'batt_volt_Min', 'LithBatt_Min', 'PTemp_Avg', 'AirTemp_Avg', 'AirTemp_Max', 'AirTemp_Min', 'RH_Avg', 'RH_Max', 'RH_Min', 'Pressure'], parse_dates=True)

    df1['Pressure'] = df2['Pressure']

    df1.to_csv(dataDir+"old/"+"processed/"+"t"+str(x)+".csv", header=False)
    
    df1 = pd.read_csv(dataDir+"processed/"+"w"+str(x)+".csv", index_col=0, names=['TIMESTAMP', 'RECORD', 'Kmh_Max3Sec', 'WS_kmh_3SecAvg_TMx', 'WindDir_3sec', 'Kmh_Mean', 'WindDir_MeanVect', 'Kmh_StDev'], parse_dates=True)

    df2 = pd.read_csv(dataDir+"processed/"+"t"+str(x)+".csv", index_col=0, names=['TIMESTAMP', 'RECORD', 'batt_volt_Min', 'LithBatt_Min', 'PTemp_Avg', 'AirTemp_Avg', 'AirTemp_Max', 'AirTemp_Min', 'RH_Avg', 'RH_Max', 'RH_Min', 'Pressure'], parse_dates=True)

    df1['Pressure'] = df2['Pressure']

    df1.to_csv(dataDir+"processed/"+"t"+str(x)+".csv", header=False)
    
    

                            
                            
                            
                            
                            
                            
                            
