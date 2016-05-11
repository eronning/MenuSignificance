from sklearn import linear_model
import numpy as np
import csv
import random

data = []
with open('../../../consolidated.csv', 'rb') as f:
	csv_reader = csv.reader(f)
	next(csv_reader, None)
	for row in csv_reader:
		data.append(row[1:])

########################SK LEARN RIDGE REGRESSION############
average_r2 = []
alpha = 10
while alpha < 1000:
	for i in range(1000):

		random.shuffle(data)
		# variables = [1, 4, 5]
		training_data = data[:2498]
		testing_data = data[2498:]

		X_train = [[float(d[i]) for i in range(0, 6)] for d in training_data]
		X_test = [[float(d[i]) for i in range(0, 6)] for d in testing_data]

		# X_train = [[float(d[i]) for i in variables] for d in training_data]
		# X_test = [[float(d[i]) for i in variables] for d in testing_data]


		Y_train = [float(d[6]) for d in training_data]
		Y_test = [float(d[6]) for d in testing_data]

		clf = linear_model.Ridge (alpha = alpha)
		clf.fit(X_train, Y_train)
		# print "Sklearn linear rgression:"
		# print "B0 coeff:", clf.intercept_, "sefood_coeff:", clf.coef_[0], "temperature coeff:", clf.coef_[1], "windspeed coeff:", clf.coef_[2], "rain coeff:", clf.coef_[3], "snow coeff:", clf.coef_[4], "peak coeff:", clf.coef_[5]
		# print "RSS:", np.mean((clf.predict(X_test) - Y_test) ** 2)
		# print "Variance Score aka R^2:", clf.score(X_test, Y_test)
		average_r2.append(clf.score(X_test, Y_test))

	print "average r2:", np.mean(average_r2), "alpha:", alpha
	alpha *= 2