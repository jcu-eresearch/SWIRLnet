#!/usr/bin/python3

import sys
import csv
import collections
import pprint
import os


directory = "../data/old/"

for filename in os.listdir(directory):
    print(filename)
    with open(directory+filename) as csvfile:
        if filename.endswith(".csv"):
            readCSV = csv.reader(csvfile, delimiter=',')
            result = collections.defaultdict(list)
            for row in readCSV:
                #print (', '.join(row))
                year = row[0].split(" ")[0]
                result[year].append(row)
       
            header=result.get('TIMESTAMP')        
            for i,j in result.items():
                file_path = "%s%s.csv"%(filename, i)
                with open(file_path, 'w') as fp:
                    writer = csv.writer(fp, delimiter=',')
                    writer.writerows(header) 
                    writer.writerows(j)       
        
