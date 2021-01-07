import axios from 'axios'

function getGeocode (lat, lng) {
    console.log(lat, lng)
    axios.get({
        url: 'https://maps.googleapis.com/maps/api/geocode/json',
        data: lat + ',' + lng })
    .then(response => (
        console.log(response)
    ))
}

export default getGeocode
