import csv
from datetime import datetime


def main():
	with open('PVD.csv', 'rb') as f:
		csv_reader = csv.reader(f)
		next(csv_reader, None)
		for row in csv_reader:
			string = row[0].split()
			#remove comma after day
			string[5] = string[5].replace(",","")
			#get rid of time zone and the word "on"
			string.pop(2)
			string.pop(2)
			#rejoin string
			string = ' '.join(string)
			#create datetime object
			date_object = datetime.strptime(string, '%I:%M %p %B %d %Y')
			
			epoch = datetime.utcfromtimestamp(0)
			



if __name__ == '__main__':
	main()