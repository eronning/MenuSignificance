import csv
import datetime
import os

import json
import urllib2
 

api_key = "a5fe3ea6-fcdc-4cfa-b8de-092afcb7edd0"

print "Fetching menu data"
try:
	# initialise your csv file
	with open('menu_data.csv', 'wb') as outfile:
		writer = csv.writer(outfile)
		headers = [] # edit these as required
		writer.writerow(headers)

		# enter the first and last day required here
		# start_date = datetime.date(2015,04,7)
		# end_date = datetime.date(2016,04,7)
		url = ("https://api.students.brown.edu/dining/menu?client_id=%s&eatery=ratty" %
					(api_key))
		data = json.load(urllib2.urlopen(url))
		# data = requests.get(url).json()
		print data

except Exception:
	os.remove(outfile)

print "Done!"
