#!/usr/bin/env python
import sys
import csv
import time
from datetime import datetime, timedelta
from collections import defaultdict

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
			connect_time_object = time_from_millis(connect)
			if valid_time(connect, connect_time_object):
				wifi_info = {
				"connect": connect,
				"disconnect": row[1],
				"mac": row[2]
				}
				key = key_from_time(connect_time_object)
				if key in wifi_data:
					# perform logic here
					date = wifi_data[key]
					hr = connect_time_object.tm_hour
					minute = connect_time_object.tm_min
					minute_timeslot = minute - minute % 15
					date[str(hr) + ":" + str(minute_timeslot)].append(wifi_info)
				else:
					wifi_data[key] = defaultdict(list)
		
		# DO SOMETHING WITH WIFI DATA WHICH IS CLEANED AND BUCKETED INTO 15 MINUTE TIMESLOTS
		print len(wifi_data.keys())		
	pass

if __name__ == '__main__':
	main()
