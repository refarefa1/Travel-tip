import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit
window.onPanTo = onPanTo
window.onRemoveLoc = onRemoveLoc
window.onAddMarker = onAddMarker
window.onGetUserPos = onGetUserPos

function onInit() {
    onAddUserPos()
    mapService.initMap()
        .then(() => {
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
}

function renderLocName(name) {
    document.querySelector('.current-location').innerText = name
}


