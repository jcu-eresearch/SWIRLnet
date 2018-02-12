#!/usr/bin/python3

import sys
import csv
import datetime
import collections
import pprint
import os
import json


unprocessedDir= "/srv/SWIRLnet/unprocessed/"
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
    jsonDates = config["cameraDateRanges"]

    for item in jsonDates:

        oldStart = item.get("oldStartDate")
        oldEnd= item.get("oldEndDate")
        newStart = item.get("newStartDate")
        newEnd= item.get("newEndDate")

        oldDir = item.get("oldDir")
        newDir= item.get("newDir")

        if not checkDate(oldStart) :
            oldEnd = datetime.datetime.now()
            oldStart = oldEnd - datetime.timedelta(days=3)
        elif not checkDate(oldEnd) :
            oldStart=datetime.datetime.strptime(oldStart, "%Y-%m-%d %H:%M:%S")
            oldEnd= oldStart + datetime.timedelta(days=3)
        else :
            oldStart=datetime.datetime.strptime(oldStart, "%Y-%m-%d %H:%M:%S")
            oldEnd=datetime.datetime.strptime(oldEnd, "%Y-%m-%d %H:%M:%S")

        if not checkDate(newStart) :
            newEnd = datetime.datetime.now()
            newStart = newEnd - datetime.timedelta(days=3)
        elif not checkDate(newEnd) :
            newStart=datetime.datetime.strptime(newStart, "%Y-%m-%d %H:%M:%S")
            newEnd= newStart + datetime.timedelta(days=3)
        else :
            newStart=datetime.datetime.strptime(newStart, "%Y-%m-%d %H:%M:%S")
            newEnd=datetime.datetime.strptime(newEnd, "%Y-%m-%d %H:%M:%S")



        for filename in os.listdir(unprocessedDir+oldDir):
            try:
                fileDir= dataDir+oldDir
                if filename.endswith(".jpg") and len(filename)>22:
                    l= len(filename)
                    date=datetime.datetime.strptime(filename[l-23: l-4], "%Y_%m_%d_%H_%M_%S")
                    if date>=oldStart and date<=oldEnd :
                        os.rename(unprocessedDir+oldDir+filename, fileDir+filename)
            except Exception as inst:
                pass


        for filename in os.listdir(unprocessedDir+newDir):
            try:
                fileDir= dataDir+newDir
                if filename.endswith(".jpg") and len(filename)>22:
                    l= len(filename)
                    date=datetime.datetime.strptime(filename[l-23: l-4], "%Y_%m_%d_%H_%M_%S")
                    if date>=newStart and date<=newEnd :
                        os.rename(unprocessedDir+newDir+filename, fileDir+filename)
            except Exception as inst:
                pass