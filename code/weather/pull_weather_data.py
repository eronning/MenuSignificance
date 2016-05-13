import csv
import datetime
import os
 
import requests # this library makes html requests much simpler

# NOTE:
# this file was pulled from the internet as an example about
# getting information from the wunderground api and was modified
# for the purpose of getting weather information about providence

# author: unknown
# modifier: eronning
# description: pulls weather information from the Wunderground API
#              and writes important information to a csv (PVD.csv)

# add your API key (from wunderground) here
api_key = "29fff3c6ccbbc531"
station_ids = ["PVD", ] # add more stations here if required
 
 
for station_id in station_ids:
	print "Fetching data for station ID: %s" % station_id
	try:
		# initialise your csv file
		with open('../../data/weather/%s.csv' % station_id, 'wb') as outfile:
			writer = csv.writer(outfile)
			headers = ['date','temperature','wind speed', 'rain', 'snow'] # edit these as required
			writer.writerow(headers)
 
			# enter the first and last day required here
			start_date = datetime.date(2015,04,7)
			end_date = datetime.date(2016,04,7)
 
			date = start_date
			while date <= end_date:
				# format the date as YYYYMMDD
				date_string = date.strftime('%Y%m%d')
				# build the url
				url = ("http://api.wunderground.com/api/%s/history_%s/q/%s.json" %
						  (api_key, date_string, station_id))
				# make the request and parse json
				data = requests.get(url).json()

				# build your row
				for history in data['history']['observations']:
					row = []
					row.append(str(history['date']['pretty']))
					row.append(str(history['tempm']))
					row.append(str(history['wspdm']))  
					row.append(str(history['rain']))
					row.append(str(history['snow']))     
					writer.writerow(row)
				# increment the day by one
				date += datetime.timedelta(days=1)
	except Exception:
		# tidy up
		os.remove(outfile)
 
print "Done!"
