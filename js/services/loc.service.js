export const locService = {
    getLocs,
    removeLoc,
    addUserPos,
    addNewLoc
}


const locs = [
    { name: 'Greatplace', lat: 32.047104, lng: 34.832384 },
    { name: 'Neveragain', lat: 32.047201, lng: 34.832581 }
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


