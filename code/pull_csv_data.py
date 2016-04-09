#!/usr/bin/env python
import sys
import csv

data_path = '/mnt/ntserver/Research/CIS_DataScience_Shared/CSCI-1951A/Ronning/4255.csv'

def main():
    '''
    For CSV:
    '''
    with open(data_path) as f:
        reader = csv.reader(f)
        header = next(reader)
        print header
        
    pass

if __name__ == '__main__':
    main()
