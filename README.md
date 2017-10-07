# make-exercises-math demo
Very simple Application that uses an express Router to serve Examples for make-exercise-math Generator via Path "/make". Uses PDF-Kit as default Rendering Engine to create a PDF-Document that will be delivered on your Browser.

## Example Usage

For a very basic example head over to openshift apps and request [http://make-exercises-math-app-make-exercises-math-app.a3c1.starter-us-west-1.openshiftapps.com/make](http://make-exercises-math-app-make-exercises-math-app.a3c1.starter-us-west-1.openshiftapps.com/make)  


Add the types-Parameter like this, to get a 3-column Worksheet:  
[http://make-exercises-math-app-make-exercises-math-app.a3c1.starter-us-west-1.openshiftapps.com/make?types=addN50N25Nof10,subN99N19Nof10,multN10N10](http://make-exercises-math-app-make-exercises-math-app.a3c1.starter-us-west-1.openshiftapps.com/make?types=addN50N25Nof10,subN99N19Nof10,multN10N10)

ExerciseTypes are separated by comma and must be contained in the listed ExercisesTypes above. 

The page has a label on top. To change it's text, add the label parameter in your Query like this:
[http://make-exercises-math-app-make-exercises-math-app.a3c1.starter-us-west-1.openshiftapps.com/make?types=multN10N10&label=my%20custom%20label](http://make-exercises-math-app-make-exercises-math-app.a3c1.starter-us-west-1.openshiftapps.com/make?types=multN10N10&label=my%20custom%20label)

## Installation 
Clone Repository, checkout current master, run 
```
npm install
```

## Test
In Root Folder, execute tests:

```
npm test
```

## Start
In Root Folder, start app with

```
npm start
```
Open a Browser at "localhost:8080/make" to review the generated PDF data.
