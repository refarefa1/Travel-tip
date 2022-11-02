import { locService } from './loc.service.js'

export const mapService = {
    initMap,
    addMarker,
    panTo,
    getLocName,
    getMap
}



// Var that is used throughout this Module (not global)
var gMap

getAddress()

function getAddress(){
    const weatherUrl = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=Museum%20of%20Contemporary%20Art%20Australia&inputtype=textquery&fields=formatted_address%2Cname%2Crating%2Copening_hours%2Cgeometry&key=AIzaSyCR-AoWkujRNfvJsI67720LaubC_uNXcPY'
    return fetch(weatherUrl)
    .then(res => res.json())
    .then(console.log)
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