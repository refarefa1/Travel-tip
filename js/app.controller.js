
import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit
window.onPanTo = onPanTo
window.onRemoveLoc = onRemoveLoc
window.onAddMarker = onAddMarker
window.onGetUserPos = onGetUserPos
window.onAddPlace = onAddPlace
window.onSearchPlace = onSearchPlace

var gLat
var gLng

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
    pos
        .then(({ coords }) => {
            mapService.getName(coords.latitude, coords.longitude)
                .then(({ name }) => {
                    locService.setName(name)
                    renderLocName(name)
                    locService.getLocs()
                        .then(renderLocs)
                })
        })
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
    const date = new Date();
    weatherData.then(obj => {
        document.querySelector('.degrees').innerText = obj.temp
        document.querySelector('.weather-icon').src = `http://openweathermap.org/img/wn/${obj.icon}.png`
        document.querySelector('.date').innerText = date.getDay() + "/" + (date.getMonth()+1) + '/' + date.getFullYear()
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

function onSearchPlace(ev) {
    ev.preventDefault()
    const place = document.querySelector('.search-input').value
    const name = mapService.searchPlace(place)
    name.then(({ address, coords }) => {
        renderLocName(address)
        const weatherData = getWeather(coords.lat, coords.lng)
        renderWeather(weatherData)
        mapService.panTo(coords.lat, coords.lng)
        document.querySelector('.search-input').value = ''
    })
}


function onAddPlace(bool) {
    const prm = new Promise((resolve, reject) => {
        if (!bool) reject('dont add')
        resolve(addSuccess)
    })
    prm
        .then(addSuccess)
        .catch(console.log)
    document.querySelector('.modal-form').classList.add('hide')

}

function addSuccess() {
    const newPlace = mapService.getName(gLat, gLng)
    newPlace
        .then(({ name }) => {
            locService.addNewLoc(name, gLat, gLng)
            locService.getLocs().then(renderLocs)
            mapService.getLocName(gLat, gLng).then(renderLocName)
            mapService.panTo(gLat, gLng)
            mapService.addMarker(({ lat: gLat, lng: gLng }))

        })
}

function addListeners() {
    let map = mapService.getMap()
    map.then((map) => {
        map.addListener('click', ev => {
            const lat = ev.latLng.lat()
            const lng = ev.latLng.lng()
            document.querySelector('.modal-form').classList.remove('hide')
            gLat = lat
            gLng = lng
        })
    })
}
