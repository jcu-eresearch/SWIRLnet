#!/usr/bin/python3

import sys
import csv
import datetime
import collections
import pprint
import os
import json


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
                        fileDir= dataDir+subDir+"processed/"
                        filePath = dataDir+subDir+"processed/"+"%s%s.csv"%(filename, i)
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

                            
                            
                            
                            
                            
                            
                            
                            
                            
