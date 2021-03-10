/* Global Variables */
const wbApiKey = '898dd45145c1421d9c7b8c5a06c06f42';
let wbBaseUrl;
const pxAbayApiKey = '20587250-ac9af3276366082f33b68d905';
let pxBaseUrl;
const countryCode = 'US';
const userName = 'stewart_mcfarlane';
let userCity;
let tripDate;
let baseUrl;
let temperature;
let imgUrl;
//imported functions
import {calcDateDifference} from './dateDifference';
import {replaceSpaces} from './replaceSpaces';
import {formatDate} from './formatDate';

// Create a new date instance dynamically with JS
let todayDate = new Date();
// let newDate = d.getMonth()+'.'+ d.getDay()+'.'+ d.getFullYear();

//grabs generate button, when it's clicked run sendData function with relevant parameters for api call
document.getElementById('generate').addEventListener('click', function(){
    userCity = document.getElementById('city').value;
    //searchParam will be used in 3rd api call (pixabay)
    let searchParam = replaceSpaces(userCity);
    // console.log(searchParam)

    tripDate = new Date(document.getElementById('year').value, document.getElementById('month').value, document.getElementById('day').value)
    let yearValue = document.getElementById('year').value
    let formattedDate = formatDate(tripDate, yearValue)
    // console.log(formattedDate)

    //geonames.org fetch call
    baseUrl = `http://api.geonames.org/searchJSON?q=${userCity}&maxRows=10&username=${userName}`
    getData(baseUrl)
    .then(function(data){
        let lat = data.geonames[0].lat;
        let lon = data.geonames[0].lng;
        let country = data.geonames[0].countryName;
        let daysToTrip = calcDateDifference(todayDate, tripDate);
        // console.log(lat, lon, country);
        // console.log(tripDate);
        // console.log(todayDate);
        // console.log(daysToTrip);
        //if trip is within a week, get current weather
        if(daysToTrip <= 7) {
            wbBaseUrl = `http://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lon}&key=${wbApiKey}`;
            getData(wbBaseUrl)
            .then(function (data) {
                temperature = data.data[0].temp
                console.log(temperature)
            })
        } //if trip longer than a week away, get predicted weather forecast data
        else {
            wbBaseUrl = `http://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${wbApiKey}`
            getData(wbBaseUrl)
            .then(function (data) {
                temperature = data.data[15].temp
                console.log(temperature)
            })
        }
       //pixabay api call (for picture)
        pxBaseUrl = `https://pixabay.com/api/?key=${pxAbayApiKey}&q=${searchParam}&image_type=photo`
        getData(pxBaseUrl)
        .then(function (data) {
            imgUrl = data.hits[0].largeImageURL;
            console.log(imgUrl)
        })
         // add data to post request
        .then(
            postData('http://localhost:2000/addData', { 
            country: country, 
            city: userCity, 
            temperature: temperature, 
            tripDate: formattedDate, 
            daysToTrip: daysToTrip, 
            imgUrl: imgUrl
        })
        )
        updateUI();
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
        //grab values
        let country = dataCollection[dataCollection.length -1].country;
        let city = dataCollection[dataCollection.length -1].city;
        let temperature = dataCollection[dataCollection.length -1].temperature;
        let tripDate = dataCollection[dataCollection.length -1].tripDate;
        let daysToTrip = dataCollection[dataCollection.length -1].daysToTrip;
        let imgUrl = dataCollection[dataCollection.length -1].imgUrl;
        
        //create 'trip' using the same elements as hard-coded trips
        const trip = `
        <div class="trip">
            <div class="left-side">
                <h4 class="destination">Your destination is: ${city}, ${country}</h4>
                <p>The closet weather forecast reads: <span id="temperature"> ${temperature} </span>degrees</p>
                <p>You're leaving on: <span id="display-date">${tripDate}</span></p>
                <p>Your trip is in <span id="countdown">${daysToTrip}</span> days!</p>
            </div>
            <div class="right-side">
                <img src="${imgUrl}" alt="">
            </div>
        </div>
        `
        //grab container
        const tripContainer = document.getElementById('trips-container');

        //add trip to container
        tripContainer.insertAdjacentHTML('afterbegin', trip);
        console.log('hello')

    } catch (error){
        console.log('Error!', error);
    }
}
