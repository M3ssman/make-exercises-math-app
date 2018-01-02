# make-exercises-math demo
Very simple Application that uses an express Router to serve Examples for make-exercise-math Generator via Path "/make". 
Uses the fantastic [PDF-Kit Library by Devon Govett][1] as default Rendering Engine to create a PDF-Document that will be delivered on your Browser.

## Installation Local
Clone Repository, checkout current master, run 
```
npm install
```

## Example Usage - GET

~~For a very basic example head over to openshift apps and request [http://make-exercises-math-app-make-exercises-math-app.a3c1.starter-us-west-1.openshiftapps.com/make](http://make-exercises-math-app-make-exercises-math-app.a3c1.starter-us-west-1.openshiftapps.com/make)~~

Start App local. Open Browser Tab. 
Add types-Parameter like this, to get a 3-column Worksheet:  
[http://localhost/make?types=addN50N25Nof10,subN99N19Nof10,multN10N10](http://localhost/make?types=addN50N25Nof10,subN99N19Nof10,multN10N10)

ExerciseTypes are separated by comma and must be contained in the listed [ExercisesTypes][2]. 

The page has a label on top. To change it's text, add the label parameter in your Query like this:
[http://localhost/make?types=multN10N10&label=my%20custom%20label](http://localhost/make?types=multN10N10&label=my%20custom%20label)

## Example Usage - POST
*Please Note, that you can really break things down this way. Application may even go down. Furthermore, the Guidance requires that you are residing on a \*nix Plattform or have a Tool similar to cURL at hand to trigger Web Requests.*

Currently, it is possible to send Exercises Type Definitions to the POST Web Endpoint and redirect the Response Data to a PDF File.
Using a Tool like cURL you can send custom Payload to the Endpoint like this:
```
curl -d '{"label":"your_Label", "exercises" : ["add_add_"] }' -H "Content-Type: application/json" -X POST http://localhost/make > response.pdf

```
This way it is also possible to send specific Type Definitions via POST:
```
curl -d '{"label":"your_label", "exercises":[{"quantity":7, "level":1, "operations":["add"],"operands":[{"range":{"min":500,"max":1000}},{"range":{"max":100}}]}]}' -H "Content-Type: application/json" -X POST http://localhost/make > response.pdf
```
Of course you might post a file containing valid JSON to the endpoint and redirect the response stream into a PDF-file or your choice:
```
curl -d "@make_02.json" -H "Content-Type: application/json" -X POST http://localhost/make > response_os.pdf
```
For a valid JSON File see this example [make_02.json](./make_02.json) 

For more Details how to define a custom Exercise of Type Math, see [Online Docs][2].


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

[1]: https://github.com/devongovett/pdfkit
[2]: https://github.com/M3ssman/make-exercises-math