import csv
import datetime
import os

import json
import urllib2
 

api_key = "a5fe3ea6-fcdc-4cfa-b8de-092afcb7edd0"

print "Fetching course data"
courses = "CSCI1380-S01,CSCI1670-S01,CSCI0160"
departments = "CSCI"
semesters = []
# initialise your csv file
course_data = []
department_data = []
with open('course_data.csv', 'wb') as outfile:
	writer = csv.writer(outfile)
	headers = [] # edit these as required
	writer.writerow(headers)
	# url to pull all of the departments
	url = ("https://api.students.brown.edu/academic/departments?client_id=%s" %
		(api_key))
	try:
		curr_info = json.load(urllib2.urlopen(url))
		for item in curr_info['items']:
			department_data.append(item['code'])
	except Exception:
		print "Error pulling departments"

	
	for code in department_data:	
		url = ("https://api.students.brown.edu/academic/departments/%s?client_id=%s" %
			(code, api_key))
		try:
			curr_info = json.load(urllib2.urlopen(url))

			next_url = curr_info['next']
			print next_url
			while next_url is not 'null':
				print 'inside'
				curr_info = json.load(urllib2.urlopen(url))
				next_url = curr_info['next']
				print next_url
		except Exception:
			print "Error pulling %s course information" % (code)


print "Done!"