import csv
import datetime
import os
import json
import urllib2
from collections import defaultdict
 

api_key = "a5fe3ea6-fcdc-4cfa-b8de-092afcb7edd0"

print "Fetching course data"
courses = "CSCI1380-S01,CSCI1670-S01,CSCI0160"
departments = "CSCI"
semesters = []
# initialise your csv file
course_data = {}
department_data = []
with open('course_data.csv', 'wb') as outfile:
	writer = csv.writer(outfile)
	headers = ['crn','full_number','number','title','seats_available','seats_total','location','start','end'] # edit these as required
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
		# try:
			# gather all the info for that department
		total_info = []
		curr_info = json.load(urllib2.urlopen(url))
		total_info.append(curr_info)
		next_url = curr_info['next']
		# gather each page of information
		# while next_url != 'null':
		# 	curr_info = json.load(urllib2.urlopen(url))
		# 	total_info.append(curr_info)
		# 	next_url = curr_info['next']
		# aggregate all the information for that department
		for info in total_info:
			info_items = info['items']
			for item in info_items:
				meeting = item['meeting']
				# check if there is a meeting time				
				if meeting:
					try:
						# take the first meeting time (in case there are multiple)
						meeting = meeting[0]
						# get the row information
						row = [item['crn'], item['full_number'], item['number'], item['title'], item['seats_available'], item['seats_total'], meeting['location'], meeting['start_time'], meeting['end_time']]
						writer.writerow(row)
						print "added course %s %s" % (item['number'], item['title'])
					except Exception:
						print "excluded invalid course (not enough information %s)" % (item['number'])
					
					
					

		# except Exception:
		# 	print "Error pulling %s course information" % (code)


print "Done!"