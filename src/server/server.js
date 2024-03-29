// Setup empty JS object to act as endpoint for all routes
projectData = [];

//used to hide api key in .env file
require('dotenv').config();

// Require Express to run server and routes
const express = require('express');

// Start up an instance of app
const app = express();

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

// Initialize the main project folder (dist folder generated by webpack)
app.use(express.static('dist'));

//getStoredData callback function
const getStoredData = (request, response) => {
    response.send(projectData);
}

//route to retrieve data from projectData
app.get('/all', getStoredData);

//sendData callback function
const sendData = (request, response) => {
    response.send(projectData);
}

//GET route that returns projectData in server code
app.get('/', sendData);

//addData callback function
const addData = (request, response) => {
    let newEntry = {
        country: request.body.country,
        city: request.body.city,
        temperature: request.body.temperature,
        tripDate: request.body.tripDate,
        daysToTrip: request.body.daysToTrip,
        imgUrl: request.body.imgUrl
    }
    //add newEntry object to projectData
    projectData.push(newEntry);
    //console log project data to check newEntry was added successfully
    console.log(projectData);
}

//POST route that adds incoming data to projectData
app.post('/addData', addData);

// Setup Server
const port = 2000;
const listening = () => {
    // console.log('Server Running');
    console.log('Server Running on Port: ' + port);
}

const server = app.listen(port, listening);

console.log(process.env);
