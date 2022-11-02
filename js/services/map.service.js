import { locService } from './loc.service.js'

export const mapService = {
    initMap,
    addMarker,
    panTo,
    getLocName,
    getMap,
    searchPlace,
    getName,
}



// Var that is used throughout this Module (not global)
var gMap



function getName(lat, lng) {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyCR-AoWkujRNfvJsI67720LaubC_uNXcPY`
    return fetch(url)
        .then(res => res.json())
        .then(res => {
            return {
                name: res.results[0].formatted_address
            }
        })
}

function searchPlace(place) {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${place}&key=AIzaSyCR-AoWkujRNfvJsI67720LaubC_uNXcPY`
    return fetch(url)
        .then(res => res.json())
        .then(res => {
            return {
                address: res.results[0].formatted_address,
                coords: res.results[0].geometry.location
            }
        })
}

function getMap() {
    return Promise.resolve(gMap)
}

function initMap(lat = 32.0749831, lng = 34.9120554) {
    return _connectGoogleApi()
        .then(() => {
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            })
        })
}

function getLocName(lat, lng) {
    return locService.getLocs()
        .then(res => {
            var currLoc = res.find(loc => loc.lat === lat && loc.lng === lng)
            console.log(currLoc);
            return Promise.resolve(currLoc.name)
        })
}


function addMarker(loc) {

    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: 'Hello World!'
    })
    return marker
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng)
    gMap.panTo(laLatLng)
}


function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    const API_KEY = 'AIzaSyCR-AoWkujRNfvJsI67720LaubC_uNXcPY'
    var elGoogleApi = document.createElement('script')
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`
    elGoogleApi.async = true
    document.body.append(elGoogleApi)

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}