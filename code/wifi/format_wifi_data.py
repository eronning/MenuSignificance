#!/usr/bin/env python
import sys
import csv
import time
from datetime import datetime, timedelta
from collections import defaultdict
from operator import itemgetter

data_path = '../../../wifi_info_cleaned.csv'

def key_from_time(wifi_info):
	return wifi_info["year"] + "," + wifi_info["month"] + "," + wifi_info["year_day"] + "," + wifi_info["week_day"]
 
def main():
	'''
	For CSV:
	'''
	with open(data_path) as f:
		reader = csv.reader(f)
		header = next(reader)
		wifi_data = {}

		for row in reader:
			wifi_info = {
				"year"       : row[0],
				"month"      : row[1],
				"year_day"   : row[2],
				"week_day"   : row[3],
				"hour"       : row[4],
				"minute"     : row[5],
				"num_people" : row[6]
			}
			key = key_from_time(wifi_info)
			if key in wifi_data:
				# perform logic here
				date = wifi_data[key]
				hour = int(wifi_info["hour"])
				minute = int(wifi_info["minute"])
				minute_timeslot = minute - minute % 15
				date[str(hour) + ":" + str(minute_timeslot)].append(wifi_info)
			else:
				wifi_data[key] = defaultdict(list)

		with open('../../../wifi_info_timeslots.csv', 'wb') as cf:
			csv_writer = csv.writer(cf)
			csv_writer.writerow(['year', 'month', 'year_day', 'week_day', 'hour', 'minute', 'num_people'])
			wifi_bucket_data = []
			for date in wifi_data:
				date_info = date.split(",")
				day = wifi_data[date]
				for timeslot in day:
					timeslot_info = timeslot.split(":")
					timeslot_data = day[timeslot]
					avg_people = sum([int(data["num_people"]) for data in timeslot_data]) / len(timeslot_data)
					bucket = [date_info[0], date_info[1], date_info[2], date_info[3], timeslot_info[0], timeslot_info[1], avg_people]
					wifi_bucket_data.append(bucket)
			# sort the information
			sorted_wifi_bucket_data = sorted(wifi_bucket_data, key=itemgetter(0,1,2,4,5))
			# write all of the information to a csv
			for bucket in sorted_wifi_bucket_data:
				csv_writer.writerow(bucket)

	pass

if __name__ == '__main__':
	main()
