import numpy as np
from sklearn.cross_validation import cross_val_score
from sklearn.tree import DecisionTreeClassifier
from sklearn.svm import SVC
from sklearn.linear_model import LogisticRegression
from sklearn.naive_bayes import BernoulliNB
import csv
import random
import argparse

classifier_data_path = '../../../consolidated_binary.csv'


def main():
	parser = argparse.ArgumentParser()
	parser.add_argument('-c', '--classifier', required = True, help=' dt | log | svm | nb')
	opts = parser.parse_args()

	clf = None
	if opts.classifier == 'dt':
		clf = DecisionTreeClassifier()
	elif opts.classifier == 'log':
		clf = LogisticRegression()
	elif opts.classifier == 'svm':
		clf = SVC()
	elif opts.classifier == 'nb':
		clf= BernoulliNB(binarize=None)
	else:
		raise Exception('Unrecognized classifier!')

	data = []
	with open(classifier_data_path, 'rb') as f:
		csv_reader = csv.reader(f)
		next(csv_reader, None)
		for row in csv_reader:
			data.append(row[1:])


	#############CROSS VALIDATION APPROACH####################
	X_data = [[float(d[i]) for i in range(0, 6)] for d in data]
	Y_data = [float(d[6]) for d in data]
	counter_1 = 0
	for i in Y_data:
		if i == 1:
			counter_1 += 1
	data_length = float(len(Y_data))
	cv = cross_val_score(clf, np.array(X_data), np.array(Y_data), cv=10)
	print "Cross Validation Score:", cv.mean()
	print "Cross Validation STD:", cv.std()
	print "Score predicting All 1's:", counter_1/data_length
	print "Score predicting All 0's:", (data_length-counter_1)/data_length
	##########################################################

	#################80-20, TRAIN-TEST SPLIT###################
	average_test_score = []
	average_train_score = []
	for i in range(100):

		random.shuffle(data)
		training_data = data[:2498]
		testing_data = data[2498:]

		X_train = [[float(d[i]) for i in range(0, 6)] for d in training_data]
		X_test = [[float(d[i]) for i in range(0, 6)] for d in testing_data]

		Y_train = [float(d[6]) for d in training_data]
		Y_test = [float(d[6]) for d in testing_data]

		clf.fit(X_train, Y_train)
		average_train_score.append(clf.score(X_train, Y_train))
		average_test_score.append(clf.score(X_test, Y_test))

	print "100-Iteration-Average 80/20 Training Score:", np.mean(average_train_score)
	print "100-Iteration-Average 80/20 Training STD:", np.std(average_train_score)
	print "100-Iteration-Average 80/20 Testing Score:", np.mean(average_test_score)
	print "100-Iteration-Average 80/20 Testing STD:", np.std(average_test_score)
	#########################################################

if __name__ == '__main__':
	main()