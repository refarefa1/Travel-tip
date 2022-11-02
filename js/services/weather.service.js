'use strict'

const WEATHER_API_KEY = '4a32cc70b65643db54db827b2747d698'
// const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=32.047104&lon=34.832384&appid=4a32cc70b65643db54db827b2747d698`
let gWeatherData 

function getWeather(lat , lng){
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=4a32cc70b65643db54db827b2747d698`
    return fetch(weatherUrl)
    .then(res=> res.json())
    .then(res => {
        const weatherPrms = {
            id: res.weather[0].id,
            locName: res.name,
            temp: res.main.temp,
            icon: res.weather[0].icon
        }
        // console.log(weatherPrms);
        gWeatherData = weatherPrms
        // console.log(gWeatherData);
        return weatherPrms
    })
}

function getWeatherData(){
    return gWeatherData
}