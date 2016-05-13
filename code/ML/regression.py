from sklearn import linear_model
import argparse
import numpy as np
import csv
import random

regression_data_path = '../../../consolidated.csv'

def main():
	parser = argparse.ArgumentParser()
	parser.add_argument('-c', '--classifier', required = True, help=' linear | lasso | ridge ')
	parser.add_argument('-a', '--alpha', default = 10, help='enter penalization value')
	opts = parser.parse_args()

	clf = None
	if opts.classifier == 'linear':
		clf = linear_model.LinearRegression(copy_X=True, fit_intercept=True, normalize=False)
	elif opts.classifier == 'lasso':
		clf = linear_model.Lasso(alpha = int(opts.alpha))
	elif opts.classifier == 'ridge':
		clf = linear_model.Ridge(alpha = int(opts.alpha))
	else:
		raise Exception('Unrecognized classifier!')

	####################PARSE THE DATA#####################
	data = []
	with open(regression_data_path, 'rb') as f:
		csv_reader = csv.reader(f)
		next(csv_reader, None)
		for row in csv_reader:
			data.append(row[1:])

	##########80-20 TRAIN-TEST SPLIT REGRESSION############
	average_test_score = []
	average_train_score = []
	intercept = []
	seafood_coef = []
	temperature_coef = []
	windspeed_coef = []
	rain_coef = []
	snow_coef = []
	peaktime_coef = []
	
	for i in range(1000):

		random.shuffle(data)
		variables = [1, 4, 5]
		training_data = data[:2498]
		testing_data = data[2498:]

		X_train = [[float(d[i]) for i in range(0, 6)] for d in training_data]
		X_test = [[float(d[i]) for i in range(0, 6)] for d in testing_data]

		Y_train = [float(d[6]) for d in training_data]
		Y_test = [float(d[6]) for d in testing_data]

		clf.fit(X_train, Y_train)
		intercept.append(clf.intercept_)
		seafood_coef.append(clf.coef_[0])
		temperature_coef.append(clf.coef_[1])
		windspeed_coef.append(clf.coef_[2])
		rain_coef.append(clf.coef_[3])
		snow_coef.append(clf.coef_[4])
		peaktime_coef.append(clf.coef_[5])
		average_train_score.append(clf.score(X_train, Y_train))
		average_test_score.append(clf.score(X_test, Y_test))

	print "1000-Iteration-Average: Intercept Coef:", np.mean(intercept), "Seafood Coef:", np.mean(seafood_coef), "Temperature Coef:", np.mean(temperature_coef), "Windspeed Coef:", np.mean(windspeed_coef), "Rain Coef:", np.mean(rain_coef), "Snow Coef:", np.mean(snow_coef), "Peaktime Coef:", np.mean(peaktime_coef)
	print "1000-Iteration-Average 80/20 Training Score(R^2 Value):", np.mean(average_train_score)
	print "1000-Iteration-Average 80/20 Training STD:", np.std(average_train_score)
	print "1000-Iteration-Average 80/20 Testing Score(R^2 Value):", np.mean(average_test_score)
	print "1000-Iteration-Average 80/20 Testing STD:", np.std(average_test_score)

	##############################################################

if __name__ == '__main__':
	main()
