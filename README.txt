# MenuSignificance

To run any portion of code (except ML):

- Just enter the directory that the file is in and type 'python filename.py'
- Make sure to run from the directory that the file is in (relative paths are used)

To run the ML section of the code:

Regressions: Linear, Ridge, LASSO. 
The code for the regressions can be found in “regression.py.” This python file takes in a classifier in the form of -c CLASSIFIER where CLASSIFIER can be ( linear | lasso | ridge). This code also takes in another input -a ALPHA where ALPHA can be any penalization value for Ridge and LASSO. This does not matter for the case of a simple linear regression. If no -a ALPHA is entered, the default is 10. This file runs an 80-20 train-test split. Once ran, it will print out the 1000-iteration-average coefficients of each of the variables, including the intercept. It will also print out the 1000-iteration-average R-squared values and std for training and testing.

Classifiers: Naive Bayes, Decision Tree, SVM, Logistic Regression.
The code for the classifiers can be found in “classifiers.py.” This python file takes in a classifier in the form of  -c CLASSIFIER where CLASSIFIER can be (dt | log | svm | nb). It will print out the cross validation score and standard deviation with 10 folds. It will also print out the baseline scores of predicting all 1’s and all 0’s. Taking another approach of an 80-20 train-test split, it will also print out the 100-iteration-average score and std for training and testing.

