import csv
import datetime
import os
import json
import urllib2
 

api_key = "a5fe3ea6-fcdc-4cfa-b8de-092afcb7edd0"
yearly = {1: 31, 2: 28, 3: 31, 4: 30, 5: 31, 6: 30, 7: 31, 8: 31, 9: 30, 10: 31, 11: 30, 12: 31}
years = [2015, 2016]

data = []

print "Fetching menu data"

# initialise your csv file

with open('../../data/menu/menu_data.json', 'wb') as outfile:
	# itearte through years
	for year in years:
		# iterate through months in year
		for month in yearly:
			# iterate through days in month
			for day in range(yearly[month]):
				# make it a day (not index format)
				day = day + 1
				# don't go past the current day -- there will be no menu data
				if (year is 2015 and month < 2) or (year is 2016 and month > 4):
					break
				url = ("https://api.students.brown.edu/dining/menu?client_id=%s&eatery=ratty&year=%s&month=%s&day=%s" %
						(api_key, year, month, day))
				try:
					curr_info = json.load(urllib2.urlopen(url))
					curr_day = {
						'menus' : curr_info['menus'],
						'num_results' : curr_info['num_results'],
						'day' : day,
						'month': month,
						'year': year
					}
					data.append(curr_day)
					print "Added menu data for %s, %s, %s" % (month, day, year)
				except Exception:
					print "No menu data for %s, %s, %s" % (month, day, year)
	data_json = {
		'name': 'menu data',
		'days': data
	}

	json.dump(data_json, outfile)

print "Done!"
