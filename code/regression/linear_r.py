from sklearn import linear_model
import numpy as np
import csv
import random

data = []
with open('../../../consolidated.csv', 'rb') as f:
	csv_reader = csv.reader(f)
	next(csv_reader, None)
	counter = 0
	seafood = []
	temp = []
	windspeed = []
	rain = []
	snow = []	
	traffic = []
	peak = []
	for row in csv_reader:
		counter += 1
		data.append(row[1:])
		seafood.append(row[1])
		temp.append(row[2])
		windspeed.append(row[3])
		rain.append(row[4])
		snow.append(row[5])
		peak.append(row[6])
		traffic.append(row[7])


########################SK LEARN LINEAR REGRESSION############
average_r2 = []
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

	clf = linear_model.LinearRegression(copy_X=True, fit_intercept=True, normalize=False)
	clf.fit(X_train, Y_train)
	# print "Sklearn linear rgression:"
	# print "B0 coeff:", clf.intercept_, "sefood_coeff:", clf.coef_[0], "temperature coeff:", clf.coef_[1], "windspeed coeff:", clf.coef_[2], "rain coeff:", clf.coef_[3], "snow coeff:", clf.coef_[4], "peak coeff:", clf.coef_[5]
	# print "RSS:", np.mean((clf.predict(X_test) - Y_test) ** 2)
	# print "Variance Score aka R^2:", clf.score(X_test, Y_test)
	average_r2.append(clf.score(X_test, Y_test))

print "average r2:", np.mean(average_r2)
##############################################################

####################NUMPY REGRESSION##########################
# y = traffic
# x = [seafood, temp, windspeed, rain, snow, peak]
# X = np.column_stack(x+[[1]*len(x[0])])
# regression = np.linalg.lstsq(X,y)
# beta_hat = regression[0]
# residuals = regression[1]
# print "coefficients:", beta_hat
# print "Numpy linear regression:"
# print "B0 coeff:", beta_hat[5], "sefood_coeff:", beta_hat[0], "temperature coeff:", beta_hat[1], "windspeed coeff:", beta_hat[2], "rain coeff:", beta_hat[3], "snow coeff:", beta_hat[4], "peak coeff:", beta_hat[5]
# print "residuals:", residuals
##############################################################
