
import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit
window.onPanTo = onPanTo
window.onRemoveLoc = onRemoveLoc
window.onAddMarker = onAddMarker
window.onGetUserPos = onGetUserPos
window.onAddPlace = onAddPlace

function onInit() {
    onAddUserPos()
    mapService.initMap()
        .then(() => {
            addListeners()
            locService.getLocs()
                .then(renderLocs)
        })
        .catch(() =>
            console.log('Error: cannot init map'))
}
function onAddUserPos() {
    const pos = getPosition()
    locService.addUserPos(pos)
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onAddMarker() {
    console.log('Adding a marker')
    mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 })
}

function onGetUserPos() {
    getPosition()
        .then(({ coords }) => {
            onPanTo(coords.latitude, coords.longitude)
        })
        .catch(err => {
            console.log('err!!!', err)
        })
}

function onPanTo(lat, lng) {
    mapService.panTo(lat, lng)
    mapService.addMarker({ lat, lng })
    mapService.getLocName(lat, lng).then(renderLocName)
    const weatherData = getWeather(lat, lng)
    renderWeather(weatherData)
}

function renderWeather(weatherData) {
    weatherData.then(obj => {
        document.querySelector('.degrees').innerHTML = obj.temp
        document.querySelector('.weather-icon').src = `http://openweathermap.org/img/wn/${obj.icon}.png`

    })
}

function renderLocs(locs) {
    let strHTML = ''
    locs.forEach(({ name, lat, lng }) => {
        strHTML += `
        <article class="saved-location flex align-center space-between">
            <h3>${name}</h3>
            <section class="location-btns">
                <button onclick="onPanTo(${lat},${lng})" class="fa go-btn"></button>
                 <button onclick="onRemoveLoc('${name}')" class="fa remove-btn"></button>
            </section>
        </article>
        `
    })

    document.querySelector('.saved-locations').innerHTML = strHTML
}

function onRemoveLoc(loc) {
    console.log('removing location... ', loc);
    locService.removeLoc(loc)
    locService.getLocs().then(renderLocs)
    mapService.initMap()
}

function renderLocName(name) {
    document.querySelector('.current-location').innerText = name
}


function onAddPlace(bool) {
    if (!bool) {
        document.querySelector('.modal-form').classList.add('hide')
        return
    }
    // addPlace(ans)
    console.log(bool);

}

function removeModal() {
    console.log('removing modal...');
}

function addListeners() {
    let map = mapService.getMap()
    map.then((map) => {
        map.addListener('click', ev => {
            const lat = ev.latLng.lat()
            const lng = ev.latLng.lng()
            document.querySelector('.modal-form').classList.remove('hide')
            const prm = new Promise((resolve, reject) =>{
                
            })
            console.log(lat, lng);
        })
    })
}


