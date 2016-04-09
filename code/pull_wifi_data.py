#!/usr/bin/env python
import sys
import csv
from collections import defaultdict

data_path = '../data/course_times.csv'
 
def main():
    '''
    For CSV:
    '''
    with open(data_path) as f:
        reader = csv.reader(f)
        header = next(reader)
        
        
    pass

if __name__ == '__main__':
    main()
