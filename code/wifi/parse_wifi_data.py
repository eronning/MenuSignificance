#!/usr/bin/env python
import sys
import csv
import time
from datetime import datetime, timedelta
from collections import defaultdict
from operator import itemgetter

data_path = '../../../wifi_info.csv'


epoch = datetime.utcfromtimestamp(0)

def unit_time_mills(epoch, dt):
	return (dt - epoch).total_seconds() * 1000.0

def time_from_millis(millis):
    """Return UTC time that corresponds to milliseconds since Epoch."""
    return time.localtime(millis)

def key_from_time(time):
	return str(time.tm_yday) + "," + str(time.tm_year)

#Dates we are cleaning:
#May 16, 2015 - September 8, 2015, summer break
may_16_15 = unit_time_mills(epoch, datetime.strptime("12:00 AM May 16 2015", '%I:%M %p %B %d %Y'))
sept_8_15 = unit_time_mills(epoch, datetime.strptime("11:59 PM September 8 2015", '%I:%M %p %B %d %Y'))
#November 25, 2015 - Novemeber 29, 2015, thanksgiving break
nov_25_15 = unit_time_mills(epoch, datetime.strptime("12:00 AM November 25 2015", '%I:%M %p %B %d %Y'))
nov_29_15 = unit_time_mills(epoch, datetime.strptime("11:59 PM November 29 2015", '%I:%M %p %B %d %Y'))
#December 22, 2015 - January 26, 2016, winter break
dec_22_15 = unit_time_mills(epoch, datetime.strptime("12:00 AM December 22 2015", '%I:%M %p %B %d %Y'))
jan_26_16 = unit_time_mills(epoch, datetime.strptime("11:59 PM January 26 2016", '%I:%M %p %B %d %Y'))
#March 26, 2016 - April 3, 2016, spring break
mar_26_16 = unit_time_mills(epoch, datetime.strptime("12:00 AM March 26 2016", '%I:%M %p %B %d %Y'))
apr_3_16 = unit_time_mills(epoch, datetime.strptime("11:59 PM April 3 2016", '%I:%M %p %B %d %Y'))



def valid_time(date_mills, time_object):
	return not ((may_16_15 <= date_mills <= sept_8_15) or (nov_25_15 <= date_mills <= nov_29_15) or (dec_22_15 <= date_mills <= jan_26_16) or (mar_26_16 <= date_mills <= apr_3_16) or (0 <= time_object.tm_hour <= 7) or (19 < time_object.tm_hour <= 23) or (time_object.tm_hour == 7 and time_object.tm_min > 30))

 
def main():
	'''
	For CSV:
	'''
	with open(data_path) as f:
		reader = csv.reader(f)
		header = next(reader)
		wifi_data = {}

		for row in reader:
			connect = int(row[0])
			disconnect = int(row[1])
			connect_time_object = time_from_millis(connect)
			disconnect_time_object = time_from_millis(disconnect)
			# keep only valid connect and disconnect times -- make sure they are on the same day (people who leave devices in the ratty)
			if valid_time(connect, connect_time_object) and valid_time(disconnect, 	disconnect_time_object) and connect_time_object.tm_yday == disconnect_time_object.tm_yday:
				wifi_info = {
				"connect": connect_time_object,
				"disconnect": disconnect_time_object,
				"mac": row[2]
				}
				key = key_from_time(connect_time_object)
				if key in wifi_data:
					# perform logic here
					date = wifi_data[key]
					# get the connecting time values
					connect_hr = int(connect_time_object.tm_hour)
					connect_min = int(connect_time_object.tm_min)
					# get the disconnecting time values
					disconnect_hr = int(disconnect_time_object.tm_hour)
					disconnect_min = int(disconnect_time_object.tm_min)
					# set the timeslots
					timeslot_hr = connect_hr
					timeslot_min = connect_min
					# fill the timeslots with a person until the connect and disconnect times meet
					while timeslot_hr != disconnect_hr or timeslot_min != disconnect_min:
						# add the person to the current timeslot
						date[str(timeslot_hr) + ":" + str(timeslot_min)].append(wifi_info)
						# update hr and min times
						if timeslot_min == 59:
							timeslot_min = 0
							timeslot_hr += 1
						else:
							timeslot_min += 1
				else:
					wifi_data[key] = defaultdict(list)
		
		# DO SOMETHING WITH WIFI DATA WHICH IS CLEANED AND BUCKETED INTO 15 MINUTE TIMESLOTS
		with open('../../../wifi_info_cleaned.csv', 'wb') as cf:
			csv_writer = csv.writer(cf)
			csv_writer.writerow(['year', 'day', 'hour', 'minute', 'num_people'])
			wifi_time_data = []
			for date in wifi_data:
				date_data = date.split(",")
				day = wifi_data[date]
				if day:
					for timeslot in day:
						timeslot_data = timeslot.split(":")
						num_people = len(day[timeslot])
						time = [int(date_data[1]), int(date_data[0]), int(timeslot_data[0]), int(timeslot_data[1]), num_people]
						wifi_time_data.append(time)

			sorted_wifi_data = sorted(wifi_time_data, key=itemgetter(0,1,2,3))
			for time in sorted_wifi_data:
				csv_writer.writerow(time)
	pass

if __name__ == '__main__':
	main()
