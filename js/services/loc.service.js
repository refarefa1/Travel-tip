export const locService = {
    getLocs,
    removeLoc
}


const locs = [
    { name: 'My location', lat: 32.047104, lng: 34.832384 },
    { name: 'Greatplace', lat: 32.047104, lng: 34.832384 },
    { name: 'Neveragain', lat: 32.047201, lng: 34.832581 }
]

function removeLoc(name) {
    const currLoc = locs.findIndex(loc => { return loc.name === name })
    locs.splice(currLoc, 1)
}

function getLocs() {
    return new Promise((resolve, reject) => {
        resolve(locs)
    })
}


