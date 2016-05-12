import csv
from datetime import datetime

epoch = datetime.utcfromtimestamp(0)

def unit_time_mills(dt):
	return (dt - epoch).total_seconds() * 1000.0

def peaktime_check(date_object):
	if ((date_object.time().hour >= 12 and date_object.time().hour < 13) or (date_object.time().hour == 13 and date_object.time().minute == 0 )) or ((date_object.time().hour >= 18 and date_object.time().minute >= 30 and date_object.time().hour < 19) or (date_object.time().hour == 19 and date_object.time().minute <= 30)):
		return True
	else:
		return False

def main():
	###############COMBINE WEATHER AND MENU DATA################
	weather_data = {}
	with open('../../data/weather/PVD_cleaned.csv', 'rb') as f:
		csv_reader = csv.reader(f)
		next(csv_reader, None)
		for row in csv_reader:
			date_string = row[0]
			date_object = datetime.strptime(date_string, '%I:%M %p %B %d %Y')
			date_mills = unit_time_mills(date_object)
			weather_data[date_mills] = row[1:]

	weather_menu_data = {}
	with open('../../data/menu/parsed_menu.csv', 'rb') as f:
		csv_reader = csv.reader(f)
		next(csv_reader, None)
		for row in csv_reader:
			date_object = datetime.strptime(row[0], '%I:%M %p %B %d %Y')
			date_mills = unit_time_mills(date_object)
			#Find the nearest weather data
			key, value = min(weather_data.items(), key=lambda (k, _): abs(k - date_mills))
			#If we can't find weather data within an hour of our data point, we won't include it anymore
			if abs(key - date_mills) < 3600000:	
				weather_menu_data[date_object] = [row[1]] + value	

	##########ADD IN TWO MORE VARIABLES, PEAKTIME, AND TRAFFIC########
	with open('../../../wifi_data/wifi_info_timeslots.csv', 'rb') as f:
		with open('../../../consolidated.csv', 'wb') as f2:
			csv_writer = csv.writer(f2)
			csv_writer.writerow(["date", "seafood", "temperature", "windspeed", "rain", "snow", "peaktime", "traffic"])
			csv_reader = csv.reader(f)
			next(csv_reader, None)
			peaktime = 0
			for row in csv_reader:
				date_info = row[:-1]
				minute = date_info[5]
				hour = date_info[4]
				year = date_info[0]
				doy = date_info[2]
				date_string = hour + ' ' + minute + ' ' + doy + ' ' + year
				date_object = datetime.strptime(date_string, '%H %M %j %Y')

				if (peaktime_check(date_object)):
					peaktime = 1
				else:
					peaktime = 0

				formatted_date = date_object.strftime("%I:%M %p %B %d %Y")
				if date_object in weather_menu_data:
					csv_writer.writerow([formatted_date , weather_menu_data[date_object][0], weather_menu_data[date_object][1], weather_menu_data[date_object][2], weather_menu_data[date_object][3], weather_menu_data[date_object][4], peaktime, row[len(row)-1]])
					
				


if __name__ == '__main__':
	main()