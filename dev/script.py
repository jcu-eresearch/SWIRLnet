#!/usr/bin/python3

import sys
import csv

with open('../data/old/t1.csv') as csvfile:
    readCSV = csv.reader(csvfile, delimiter=',')
    for row in readCSV:
        print (', '.join(row))