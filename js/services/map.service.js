import { locService } from './loc.service.js'

export const mapService = {
    initMap,
    addMarker,
    panTo,
    geocodeLatLng,
    getLocName
}



// Var that is used throughout this Module (not global)
var gMap
var gLocName

function initMap(lat = 32.0749831, lng = 34.9120554) {
    return _connectGoogleApi()
    .then(() => {
        gMap = new google.maps.Map(
            document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            })
            const geocoder = new google.maps.Geocoder()
            const infowindow = new google.maps.InfoWindow()
            gLocName = geocodeLatLng(geocoder, gMap, infowindow)
        })
}

function geocodeLatLng(geocoder, map, infowindow) {
    const latlng = {
        lat: parseFloat(map.center.lat()),
        lng: parseFloat(map.center.lng()),
    }
    return geocoder
        .geocode({ location: latlng })
        .then((response) => {
            if (response.results[0]) {
                map.setZoom(11);
                const marker = new google.maps.Marker({
                    position: latlng,
                    map: map,
                });
                infowindow.setContent(response.results[0].formatted_address);
                infowindow.open(map, marker);
                return response.results[0].formatted_address
            } else {
                window.alert("No results found");
            }
        })
        .catch((e) => window.alert("Geocoder failed due to: " + e));
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