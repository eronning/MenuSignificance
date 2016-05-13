import csv
import datetime
import os
import json
import urllib2
 

# author: eronning
# description: pulls menu information from the Brown API
#              and grabs important information which is written
#              to a file (menu_data.json) in a json format

# brown api key
api_key = "a5fe3ea6-fcdc-4cfa-b8de-092afcb7edd0"
# map of months to days
yearly = {1: 31, 2: 28, 3: 31, 4: 30, 5: 31, 6: 30, 7: 31, 8: 31, 9: 30, 10: 31, 11: 30, 12: 31}
# years of data to pull (max possible from api)
years = [2015, 2016]
# array to store all data in
data = []

print "Fetching menu data"

# initialize your csv file
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
					# try pulling json from the url
					curr_info = json.load(urllib2.urlopen(url))
					# turn the information into a custom object
					curr_day = {
						'menus' : curr_info['menus'],
						'num_results' : curr_info['num_results'],
						'day' : day,
						'month': month,
						'year': year
					}
					# add the information to array
					data.append(curr_day)
					print "Added menu data for %s, %s, %s" % (month, day, year)
				except Exception:
					print "No menu data for %s, %s, %s" % (month, day, year)
	# make a json object to write
	data_json = {
		'name': 'menu data',
		'days': data
	}
	# write the information to a file
	json.dump(data_json, outfile)

print "Done!"
