#!/usr/bin/env python
import sys
import csv
import time
from datetime import datetime, timedelta
from collections import defaultdict
from operator import itemgetter

# author: eronning
# description: formats wifi information in a format where the data will align
#              with other data being run in models. the data
#              is formatted and written to a csv (wifi_info_timeslots.csv)
#              in a sorted format. -- file not included for privacy reasons

data_path = '../../../wifi_info_cleaned.csv'

# key_from_time gets a key from a wifi object
# @param wifi_info to generate a key for
# return a key that represent the wifi info object
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
		# read through each line of the csv
		for row in reader:
			# generate wifi object from the information
			wifi_info = {
				"year"       : row[0],
				"month"      : row[1],
				"year_day"   : row[2],
				"week_day"   : row[3],
				"hour"       : row[4],
				"minute"     : row[5],
				"num_people" : row[6]
			}
			# get a key for the object
			key = key_from_time(wifi_info)
			if key in wifi_data:
				# perform logic here
				date = wifi_data[key]
				hour = int(wifi_info["hour"])
				minute = int(wifi_info["minute"])
				# bucket the information in 15 min timeslots
				minute_timeslot = minute - minute % 15
				date[str(hour) + ":" + str(minute_timeslot)].append(wifi_info)
			else:
				# there are no objects at that key so fill it with a default dict
				wifi_data[key] = defaultdict(list)

		# write the information gathered to a csv
		with open('../../../wifi_info_timeslots.csv', 'wb') as cf:
			csv_writer = csv.writer(cf)
			csv_writer.writerow(['year', 'month', 'year_day', 'week_day', 'hour', 'minute', 'num_people'])
			wifi_bucket_data = []
			# iterate through all of the data
			for date in wifi_data:
				date_info = date.split(",")
				day = wifi_data[date]
				# get each timeslot for each day
				for timeslot in day:
					# pull out all of the information
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
