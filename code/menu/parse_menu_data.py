import datetime
import os
import json
import urllib2

data_path = '../../data/menu/menu_data.json'

with open(data_path) as in_file:    
    data = json.load(in_file)
    days_data = data['days']
    for day in days_data:
    	# make sure that it is a full days worth of meals
    	if day['num_results'] == 3:
    		menus = day['menus']
    		for menu in menus:
    			# bucket information
    		break