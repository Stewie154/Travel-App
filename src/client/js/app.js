/* Global Variables, empty values will be set throughout various api calls*/
const wbApiKey = '898dd45145c1421d9c7b8c5a06c06f42';
let wbBaseUrl;
const pxAbayApiKey = '20587250-ac9af3276366082f33b68d905';
let pxBaseUrl;
const countryCode = 'US';
const userName = 'stewart_mcfarlane';
let lat;
let lon;
let country;
let userCity;
let tripDate;
let formattedDate;
let daysToTrip;
let baseUrl;
let temperature;
let imgUrl;
let cityDisplay;
let searchParam;

//imported functions
import {calcDateDifference} from './dateDifference';
import {replaceSpaces} from './replaceSpaces';
import {formatDate} from './formatDate';

// Create a new date instance dynamically with JS
let todayDate = new Date();

document.getElementById('generate').addEventListener('click', function(){
    handleSubmit()
})

const geoNamesApiCall = async () => {
    //set user city
    userCity = document.getElementById('city').value;
    //set trip date as Date object
    tripDate = new Date(document.getElementById('year').value, document.getElementById('month').value, document.getElementById('day').value)
    //grab year
    let yearValue = document.getElementById('year').value
    //format date
    formattedDate = formatDate(tripDate, yearValue)
    baseUrl = `http://api.geonames.org/searchJSON?q=${userCity}&maxRows=10&username=${userName}`
    try {
        await getData(baseUrl)
        .then(function(data){
            lat = data.geonames[0].lat;
            lon = data.geonames[0].lng;
            country = data.geonames[0].countryName;
            daysToTrip = calcDateDifference(todayDate, tripDate);
            //log with number to check order of api calls (1, 2, 3)
            console.log('1. ', lat, lon, country, daysToTrip)
        })
    } 
    catch (error) {
        console.log('Error! (geoNamesApiCall)', error)
    }
}

const weatherBitApiCall = async () => {
    if(daysToTrip <= 7) {
        wbBaseUrl = `http://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lon}&key=${wbApiKey}`;
        try {
           await getData(wbBaseUrl)
           .then(function(data){
                temperature = data.data[0].temp
                cityDisplay = data.data[0].city_name
                //log with number to check order of api calls (1, 2, 3)
                console.log('2. ', temperature, cityDisplay)
           })
           
        } catch (error) {
            console.log('Error! (weatherBitApiCall)', error)
        }
    } else {
        wbBaseUrl = `http://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${wbApiKey}`
        try {
            await getData(wbBaseUrl)
            .then(function(data){
                temperature = data.data[15].temp
                cityDisplay = data.city_name
                //log with number to check order of api calls (1, 2, 3)
                console.log('2. ', temperature, cityDisplay)
            })
            
        } catch (error) {
            console.log('Error! (weatherBitApiCall)', error)
        }
    }
}

const pixabayApiCall = async () => {
    searchParam = replaceSpaces(userCity);
    pxBaseUrl = `https://pixabay.com/api/?key=${pxAbayApiKey}&q=${searchParam}&image_type=photo`
    try {
        await getData(pxBaseUrl)
        .then(function(data){
            imgUrl = data.hits[0].largeImageURL;
            console.log('3. ', imgUrl)
        })
    } catch (error) {
        console.log('Error! (pixabayApiCall)', error)
    }
}

const handleSubmit = async () => {
    try {
        await geoNamesApiCall();
        await weatherBitApiCall();
        await pixabayApiCall();
        await postData('http://localhost:2000/addData', {
            country: country, 
            city: cityDisplay, 
            temperature: temperature, 
            tripDate: formattedDate, 
            daysToTrip: daysToTrip, 
            imgUrl: imgUrl
        })
        .then(await updateUI())
    } catch (error) {
        console.log('Error! (handleSubmit)', error)
    }
}

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
        console.log('UI Updated')

    } catch (error){
        console.log('Error! (updateUI)', error);
    }
}

export {handleSubmit}