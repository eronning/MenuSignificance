from datetime import datetime
import os
import json
import urllib2

data_path = '../../data/menu/menu_data.json'

def unit_time_mills(epoch, dt):
	return (dt - epoch).total_seconds() * 1000.0


epoch = datetime.utcfromtimestamp(0)
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

dicti = {}
with open(data_path) as in_file:    
	data = json.load(in_file)
	#406 days
	days_data = data['days']
	for day in days_data:
		# make sure that it is a full days worth of meals
		# 346 full days and 60 not full days
		# print day['month'], day['day'], day['year']
		date_string = '7:00 AM ' + str(day['month']) + ' ' +str(day['day']) + ' ' + str(day['year'])
		# print date_string
		date_object = datetime.strptime(date_string, '%I:%M %p %m %d %Y')
		
		# if day['num_results'] == 3:
			#corresponds to breakfast, 1 would be lunch, 2 would be dinner
			# menus = day['menus']
			# for menu in menus:
				
				# print menu['bistro']
				# if len(menu['bistro']) == 0:
					# print menu
					# print "true"
				# if menu['bistro'][0] not in dicti:
					# dicti[menu['bistro'][0]] = 1
				# else:
					# dicti[menu['bistro'][0]] += 1
				# bucket information	
			# break
			# else:
			# 	not_full += 1

