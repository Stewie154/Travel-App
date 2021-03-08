/* Global Variables */
const WbApiKey = '898dd45145c1421d9c7b8c5a06c06f42';
const countryCode = 'US';
const userName = 'stewart_mcfarlane';
let userCity;
let tripDate;
let baseUrl;
import {calcDateDifference} from './dateDifference'

// Create a new date instance dynamically with JS
let todayDate = new Date();
// let newDate = d.getMonth()+'.'+ d.getDay()+'.'+ d.getFullYear();

//grabs generate button, when it's clicked run sendData function with relevant parameters for api call
document.getElementById('generate').addEventListener('click', function(){
    userCity = document.getElementById('city').value;
    // tripDate = document.getElementById('day').value + '.' + document.getElementById('month').value + '.' + document.getElementById('year').value
    // tripDate = new Date(document.getElementById('month').value + '/' + document.getElementById('day').value + '/' + document.getElementById('year').value)
    tripDate = new Date(document.getElementById('year').value, document.getElementById('month').value, document.getElementById('day').value)
    //geonames.org fetch call
    baseUrl = `http://api.geonames.org/searchJSON?q=${userCity}&maxRows=10&username=${userName}`
    getData(baseUrl)
    .then(function(data){
        console.log(data);
        let lat = data.geonames[0].lat;
        let long = data.geonames[0].lng;
        let country = data.geonames[0].countryName;
        console.log(lat, long, country)
        console.log(tripDate)
        console.log(todayDate)
        console.log(calcDateDifference(todayDate, tripDate))
        //add data to post request
        // let userResponse = document.getElementById('feelings').value;
        // postData('http://localhost:2000/addData', {temperature: data.main.temp, date: newDate, userResponse: userResponse})
        // updateUI();
    })
});

//getData async function to make get request to OpenWeatherMap api (get the weather)
const getData = async(url) => {
    //await response of call to api for data
    const response = await fetch(url);
    //if fetch call successful, run try code
    try {
        //wait for data to be fetched and turned in json
        const data = await response.json();
        //see the json data in console
        console.log(data);
        return data;
    }
    //if fetch call unsuccessful, run catch code
    catch (error){
        console.log('Error!', error);
    }
}

//postData async function to store the weather data in the app 
const postData = async(url = '', dataObject) => {
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataObject),
    });
    try {
        const newData = await response.json();
        console.log(newData);
        return newData;
    } catch (error) {
        console.log('Error!', error);
    }
}

//function to display data retrieved to in the UI 
const updateUI = async () => {
    //request to get stored projectData from server.js via all route
    const request = await fetch('http://localhost:2000/all');
    try {
        //converts dataCollection from string to json
        const dataCollection = await request.json();
        //display the date, temp, userResponse from last element in DC array, always displays latest entry
        document.getElementById('date').innerHTML = 'Date: ' + dataCollection[dataCollection.length -1].date;
        document.getElementById('temp').innerHTML = 'Temperature: ' + dataCollection[dataCollection.length -1].temperature;
        document.getElementById('content').innerHTML = 'Feelings: ' + dataCollection[dataCollection.length -1].userResponse;
    } catch (error){
        console.log('Error!', error);
    }
}
