export const locService = {
    getLocs,
    removeLoc,
    addUserPos,
    addNewLoc
}


const locs = [
    { name: 'Azrieli', lat: 32.072857, lng: 34.793352 },
    { name: 'Tel Hashomer', lat: 32.046643, lng: 34.844534 }
]

function addUserPos(pos) {
    pos.then(({ coords }) => {
        addNewLoc('My location', coords.latitude, coords.longitude)
    })
}

function addNewLoc(name, lat, lng) {
    const loc = {
        name,
        lat,
        lng
    }
    locs.unshift(loc)
    return loc
}

function removeLoc(name) {
    const currLoc = locs.findIndex(loc => { return loc.name === name })
    locs.splice(currLoc, 1)
}

function getLocs() {
    return new Promise((resolve, reject) => {
        resolve(locs)
    })
}


