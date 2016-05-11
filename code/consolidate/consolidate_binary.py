import csv
from datetime import datetime

def unit_time_mills(epoch, dt):
	return (dt - epoch).total_seconds() * 1000.0

def peaktime_check(date_object):
	if ((date_object.time().hour >= 12 and date_object.time().hour < 13) or (date_object.time().hour == 13 and date_object.time().minute == 0 )) or ((date_object.time().hour >= 18 and date_object.time().minute >= 30 and date_object.time().hour < 19) or (date_object.time().hour == 19 and date_object.time().minute <= 30)):
		return True
	else:
		return False

def main():
	part_combined = {}
	with open('../../data/weather/PVD_cleaned_2.csv', 'rb') as f:
		csv_reader = csv.reader(f)
		next(csv_reader, None)
		for row in csv_reader:
			date_string = row[0]
			date_object = datetime.strptime(date_string, '%I:%M %p %B %d %Y')
			part_combined[date_object] = row[1:]
	# print part_combined	
	parsed_wifi_data = {}

	with open('../../../wifi_data/wifi_info_timeslots.csv', 'rb') as f:
		with open('../../../consolidated_binary.csv', 'wb') as f2:
			csv_writer = csv.writer(f2)
			csv_writer.writerow(["date", "seafood", "temp", "windspeed", "rain", "snow", "peaktime","heavy_traffic"])
			csv_reader = csv.reader(f)
			next(csv_reader, None)
			peaktime = 0
			heavy_traffic = 0
			for row in csv_reader:
				date_info = row[:-1]
				# print date_info
				minute = date_info[5]
				hour = date_info[4]
				year = date_info[0]
				doy = date_info[2]
				date_string = hour + ' ' + minute + ' ' + doy + ' ' + year
				date_object = datetime.strptime(date_string, '%H %M %j %Y')
				# print date_object.time().hour
				if (peaktime_check(date_object)):
					peaktime = 1
				else:
					peaktime = 0

				if int(row[len(row)-1]) >= 200:
					heavy_traffic = 1
				else:
					heavy_traffic = 0

				formatted_date = date_object.strftime("%I:%M %p %B %d %Y")
				if date_object in part_combined:
					csv_writer.writerow([formatted_date , part_combined[date_object][0], part_combined[date_object][1], part_combined[date_object][2], part_combined[date_object][3], part_combined[date_object][4], peaktime, heavy_traffic])
					
				


if __name__ == '__main__':
	main()