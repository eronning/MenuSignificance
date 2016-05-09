import csv
from datetime import datetime


def unit_time_mills(epoch, dt):
	return (dt - epoch).total_seconds() * 1000.0

def main():
	data = {}
	epoch = datetime.utcfromtimestamp(0)
	with open('../../data/weather/PVD_cleaned.csv', 'wb') as f1:
		csv_writer = csv.writer(f1)
		csv_writer.writerow(['date', 'temperature', 'wind speed', 'rain', 'snow'])
		with open('../../data/weather/PVD.csv', 'rb') as f:
			csv_reader = csv.reader(f)
			next(csv_reader, None)
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

			# print mar_26_16, apr_3_16
			for row in csv_reader:
				string = row[0].split()
				#remove comma after day
				string[5] = string[5].replace(",","")
				#get rid of time zone and the word "on"
				string.pop(2)
				string.pop(2)
				#rejoin string
				string = ' '.join(string)
				date_object = datetime.strptime(string, '%I:%M %p %B %d %Y')
				date_mills = unit_time_mills(epoch, date_object)
				information = row[1:]
				# print information[0]
				if not ((may_16_15 <= date_mills <= sept_8_15) or (nov_25_15 <= date_mills <= nov_29_15) or (dec_22_15 <= date_mills <= jan_26_16) or (mar_26_16 <= date_mills <= apr_3_16) or (0 <= date_object.hour <= 7) or (19 < date_object.hour <= 23) or (date_object.hour == 7 and date_object.minute > 30)):
					csv_writer.writerow([string , information[0], information[1], information[2], information[3]])
					data[date_mills] = information


############################################
#This is combining the menu and weather data
	menu_data = {}
	with open('../../data/menu/parsed_menu.csv', 'rb') as f2:
		with open('../../data/weather/PVD_cleaned_2.csv', 'wb') as f3:
			csv_writer = csv.writer(f3)
			csv_writer.writerow(["date", "seafood", "temp", "windspeed", "rain", "snow"])
			csv_reader = csv.reader(f2)
			next(csv_reader, None)
			for row in csv_reader:
				date_time = datetime.strptime(row[0], '%I:%M %p %B %d %Y')
				dateinmills = unit_time_mills(epoch, date_time)
				key, value = min(data.items(), key=lambda (k, _): abs(k - dateinmills))
				if abs(key - dateinmills) > 3600000:
					print "day too far"
				else:	
					csv_writer.writerow([row[0], row[1], value[0], value[1], value[2], value[3]])

if __name__ == '__main__':
	main()