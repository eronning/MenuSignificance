#!/usr/bin/env python
import sys
import csv
from collections import defaultdict

data_path = '../../data/course/course_data.csv'
 
def main():
	'''
	For CSV:
	'''
	with open(data_path) as f:
		reader = csv.reader(f)
		header = next(reader)
		total_seats = 5
		available_seats = 4
		included_cols = [2, 3, 6]
		all_data = []
		starting_grouping = defaultdict(list)
		ending_grouping = defaultdict(list)
		for row in reader:
			size = int(row[total_seats]) - int(row[available_seats])
			start_time = row[7]
			end_time = row[8]
			content = {
				'course': row[2],
				'title': row[3],
				'size': size,
				'location': row[6],
				'start_time': start_time,
				'end_time': end_time
			}
			all_data.append(content)
			starting_grouping[start_time].append(content)
			ending_grouping[end_time].append(content)
	pass

if __name__ == '__main__':
	main()
