import csv
import datetime
import os

import json
import urllib2
 

api_key = "a5fe3ea6-fcdc-4cfa-b8de-092afcb7edd0"
yearly = {1: 31, 2: 28, 3: 31, 4: 30, 5: 31, 6: 30, 7: 31, 8: 31, 9: 30, 10: 31, 11: 30, 12: 31}
years = [2015, 2016, 2017]

data = []

print "Fetching menu data"

# initialise your csv file

with open('menu_data.csv', 'wb') as outfile:
	writer = csv.writer(outfile)
	headers = [] # edit these as required
	writer.writerow(headers)
	for year in years:
		for month in yearly:
			for day in range(yearly[month]):
				# don't go past the current day -- there will be no menu data
				if year is 2015 and month is 4 and day is 8:
					break
				url = ("https://api.students.brown.edu/dining/menu?client_id=%s&eatery=ratty&year=%s&month=%s&day=%s" %
						(api_key, year, month, day + 1))
				try:
					data.append(json.load(urllib2.urlopen(url)))
					print url 
				except Exception:
					print "No menu data for %s, %s, %s" % (month, day, year)


print "Done!"
