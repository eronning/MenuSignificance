#!/usr/bin/env python
import sys
import csv
import time
from datetime import datetime, timedelta
from collections import defaultdict
from operator import itemgetter

data_path = '../../data/course/course_data.csv'

def getTimeObject(time, day_of_week, semester):
	hours = time / 3600;
	minutes = (time % 3600) / 60;
	time_object = {
		"hour"        : hours,
		"minute"      : minutes,
		"day_of_week" : day_of_week,
		"semester"    : semester
	}
	return time_object

def key_from_time(time_object):
	return str(time_object["semester"]) + ',' + str(days[time_object["day_of_week"]]) + ',' + str(time_object["hour"]) + ',' + str(time_object["minute"])

days = {"M": 0, "T": 1, "W": 2, "R": 3, "F": 4}

def main():
	'''
	For CSV:
	'''
	with open(data_path) as f:
		reader = csv.reader(f)
		header = next(reader)
		course_data = {}
		starting_grouping = defaultdict(list)
		ending_grouping = defaultdict(list)
		for row in reader:
			semester = row[0]
			size = int(row[6]) - int(row[5])
			day_of_week = row[8]
			start_time = int(row[9])
			end_time = int(row[10])
			# get time objects
			start_time_object = getTimeObject(start_time, day_of_week, semester)
			end_time_object = getTimeObject(end_time, day_of_week, semester)
			course_info = {
				'semester'	  : semester,
				'course'      : row[3],
				'title'       : row[4],
				'num_people'  : size,
				'location'    : row[7],
				'day_of_week' : day_of_week,
				'start_time'  : start_time_object,
				'end_time'    : end_time_object
			}
			if day_of_week in days:
				key = key_from_time(start_time_object)
				if key in course_data:
					# perform logic here
					date = course_data[key]
					# get the connecting time values
					start_hr = int(start_time_object["hour"])
					start_min = int(start_time_object["minute"])
					# get the disconnecting time values
					end_hr = int(end_time_object["hour"])
					end_min = int(end_time_object["minute"])
					# set the timeslots
					timeslot_hr = start_hr
					timeslot_min = start_min
					# fill the timeslots with a course until tht times meet
					while timeslot_hr != end_hr or timeslot_min != end_min:
						# add the course to the current timeslot
						date[str(timeslot_hr) + ":" + str(timeslot_min)].append(course_info)
						# update hr and min times
						if timeslot_min == 59:
							timeslot_min = 0
							timeslot_hr += 1
						else:
							timeslot_min += 1
				else:
					course_data[key] = defaultdict(list)

		# Clean information and write it to a csv
		with open('../../data/course/course_data_cleaned.csv', 'wb') as cf:
			csv_writer = csv.writer(cf)
			csv_writer.writerow(['semester', 'week_day', 'hour', 'minute', 'num_people'])
			course_time_data = defaultdict(list)
			# iterate through all days
			for date in course_data:
				date_data = date.split(",")
				day = course_data[date]
				# check if the day has any timeslots
				if day:
					# iterate through each timeslote
					for timeslot in day:
						timeslot_data = timeslot.split(":")
						# pulling out the num people 
						num_people = sum([data['num_people'] for data in day[timeslot]])
						# building a row for that timeslot
						time = [date_data[0], date_data[1], int(timeslot_data[0]), int(timeslot_data[1]), int(num_people)]
						course_timeslot_key = date_data[0] + ',' + date_data[1] + ',' + timeslot_data[0] + ',' + timeslot_data[1]
						# add data to map for combination
						course_timeslot = course_time_data[course_timeslot_key]
						timeslot_hour = int(timeslot_data[0])
						timeslot_min = int(timeslot_data[1])
						if not ((0 <= timeslot_hour <= 7) or (19 < timeslot_hour <= 23) or (timeslot_hour == 7 and timeslot_min > 30)):
							course_timeslot.append(time)
						course_time_data[course_timeslot_key] = course_timeslot


			combined_course_data = []
			# combine same timeslots
			for timeslot in course_time_data:
				data = course_time_data[timeslot]
				if data:
					num_people = sum([d[4] for d in data])
					reference = data[0]
					combined_time = [reference[0], reference[1], reference[2], reference[3], num_people]
					combined_course_data.append(combined_time)
				
			# sort the information
			sorted_course_data = sorted(combined_course_data, key=itemgetter(0,1,2,3))

			# write all of the information to a csv
			for time in sorted_course_data:
				csv_writer.writerow(time)

	pass

if __name__ == '__main__':
	main()
