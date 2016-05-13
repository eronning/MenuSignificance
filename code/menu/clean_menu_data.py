from datetime import datetime
import os
import json
import urllib2
import calendar
import operator
import csv
# author: blnguyen
# description: cleans the menu data from the menu_data.json and 
#			   also formats it correctly so that it could later be integrated

data_path = '../../data/menu/menu_data.json'
output_path = '../../data/menu/menu_data_cleaned.csv'

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

seadict = {}

#Key words for seafood!
seafood = ['shrimp', 'hake', 'tilapia', 'haddock', 'scrod', 'flounder', 'fish', 'clams', 'salmon', 'sole', 'seafood', 'scallop']
#These buckets are to help write and format the data
breakfast_buckets = ["7:30 AM ", "7:45 AM ", "8:00 AM ", "8:15 AM ", "8:30 AM ", "8:45 AM ", "9:00 AM ", "9:15 AM ", "9:30 AM ", "9:45 AM ", "10:00 AM ", "10:15 AM ", "10:30 AM ", "10:45 AM "]
lunch_buckets = ["11:00 AM ", "11:15 AM ", "11:30 AM ", "11:45 AM ", "12:00 PM ", "12:15 PM ", "12:30 PM ", "12:45 PM ", "1:00 PM ", "1:15 PM ", "1:30 PM ", "1:45 PM ", "2:00 PM ", "2:15 PM ", "2:30 PM ", "2:45 PM ", "3:00 PM ", 
"3:15 PM ", "3:30 PM ", "3:45 PM "] 
dinner_buckets = ["4:00 PM ", "4:15 PM ", "4:30 PM ", "4:45 PM ", "5:00 PM ", "5:15 PM ", "5:30 PM ", "5:45 PM ", "6:00 PM ", "6:15 PM ", "6:30 PM ", "6:45 PM ", "7:00 PM ", "7:15 PM ", "7:30 PM "]

with open(data_path) as in_file:    
	data = json.load(in_file)
	#406 days
	days_data = data['days']
	for day in days_data:
		# make sure that it is a full days worth of meals
		# 346 full days and 60 not full days
		random_time = '7:30 AM ' 
		date_string = str(day['month']) + ' ' +str(day['day']) + ' ' + str(day['year'])
		combined_string = random_time + date_string

		date_object = datetime.strptime(combined_string, '%I:%M %p %m %d %Y')
		date_mills = unit_time_mills(epoch, date_object)
		if not ((may_16_15 <= date_mills <= sept_8_15) or (nov_25_15 <= date_mills <= nov_29_15) or (dec_22_15 <= date_mills <= jan_26_16) or (mar_26_16 <= date_mills <= apr_3_16)):
			if day['num_results'] == 3:
				counter += 1
				# corresponds to breakfast, 1 would be lunch, 2 would be dinner
				menus = day['menus']
				for menu in menus:
					time = 0

					#Breakfast is from [7:30am to 11:00AM)
					if menu['meal'] == "breakfast":
						time = breakfast_buckets
					#Lunch is from [11:00AM to 4:00PM)
					elif menu['meal'] == "lunch":
						time = lunch_buckets
					#Dinner is from [4:00PM to 7:30PM]
					else:
						time = dinner_buckets
			
					for i in time:
						string_helper = i + str(calendar.month_name[int(day['month'])]) + ' ' + str(day['day']) + ' ' + str(day['year'])
						key = unit_time_mills(epoch, datetime.strptime(string_helper, '%I:%M %p %B %d %Y'))
						#Get the very first item in the bistor line and split it 
						items = menu['bistro'][0].split()
						#Check to see if anything in items has anything in seafood keywords
						if not set(items).isdisjoint(seafood):
							seadict[int(key)] = [1, string_helper]
						##########Categorize by meat?#########
						# elif "beef" in items:
							# seadict[int(key)] = [2, string_helper]
						# elif "chicken" in items:
							# seadict[int(key)] = [3, string_helper]
						# elif "pork" in items:
							# seadict[int(key)] = [4, string_helper]
						else:
							seadict[int(key)] = [0, string_helper]

#Sort the dictionary so it is sorted by dates in milliseconds since I'm not sure
#if we can sort by datetimes
sorted_seadict = sorted(seadict.items(), key=operator.itemgetter(0))

#Loop through the sorted dictionary and write out the cleanly formatted data
with open(output_path, 'wb') as f:
	csv_writer = csv.writer(f)
	csv_writer.writerow(['Date', 'Seafood'])
	for k in sorted_seadict:
		csv_writer.writerow([k[1][1], k[1][0]])






