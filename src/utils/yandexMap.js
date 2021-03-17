import axios from 'axios'

const POINT_SEARCH_KEYS = [
  '8fb635ed-f033-4166-8286-a5388bb7d9a9',
  '3e9a1241-7241-4975-b2a1-77203e9c0333',
  '679a08be-aa49-4a79-ad31-80c65dda374a'
]
const PLACE_SEARCH_KEYS = [
  'a80458a5-709e-453d-831a-ae89e1db36a5',
  '90019ff7-9264-40fe-9cf3-00c7d41c1b92',
  '586ceb0e-2504-440d-9972-997af51914d1'
]

let PLACE_SEARCH_INDEX = 0
let POINT_SEARCH_INDEX = 0

function placeSearch (value) {
  return new Promise((resolve, reject) => {
    const key = PLACE_SEARCH_KEYS[PLACE_SEARCH_INDEX]
    if (!key) {
      // eslint-disable-next-line prefer-promise-reject-errors
      reject({ error: 'Yandex Geo Coder key is expired' })
      return
    }

    if (value) {
      axios({
        method: 'get',
        url: 'https://search-maps.yandex.ru/v1/',
        params: {
          type: 'biz',
          apikey: key,
          text: value,
          lang: 'ru-RU',
          results: 5,
          ll: '69.241320,41.292906',
          spn: '1.5,1.5',
          rspn: 1
        }
      }).then(res => {
        const members = res.data.features
        if (members.length > 0) {
          const result = members.map(map => {
            return {
              name: map.properties.name,
              description: map.properties.description,
              latlong: {
                lat: map.geometry.coordinates[1],
                lon: map.geometry.coordinates[0]
              },
              type: map.geometry.type
            }
          })
          resolve(result)
        } else {
          resolve([])
        }
        // console.log(res)
      }).catch(err => {
        if (err.response.status === 403) {
          PLACE_SEARCH_INDEX++
          console.log('geocored next key selected')
          placeSearch(value)
            .then(resolve)
            .catch(reject)
        }
      })
    }
  })
}

function pointSearch (value) {
  return new Promise((resolve, reject) => {
    const key = POINT_SEARCH_KEYS[POINT_SEARCH_INDEX]
    if (!key) {
      // eslint-disable-next-line prefer-promise-reject-errors
      reject({ error: 'Yandex Organization key is expired' })
      return
    }

    if (value) {
      axios({
        method: 'get',
        url: 'https://geocode-maps.yandex.ru/1.x/',
        params: {
          format: 'json',
          apikey: key,
          geocode: value,
          sco: 'latlong',
          lang: 'ru-RU',
          results: 5,
          ll: '69.241320,41.292906',
          spn: '6.5,6.5',
          rspn: 1
        }
      }).then(res => {
        const members = res.data.response.GeoObjectCollection.featureMember
        if (members.length > 0) {
          const result = members.map(map => {
            return {
              name: map.GeoObject.name,
              latlong: {
                lat: map.GeoObject.Point.pos.split(' ')[1],
                lon: map.GeoObject.Point.pos.split(' ')[0]
              },
              type: map.GeoObject.metaDataProperty.GeocoderMetaData.kind,
              description: map.GeoObject.description
            }
          })
          resolve(result)
        } else {
          resolve([])
        }
        // console.log(res)
      }).catch(err => {
        if (err.response.status === 403) {
          console.log('next point key selected')
          POINT_SEARCH_INDEX++
          pointSearch(value)
            .then(resolve)
            .catch(reject)
        }
      })
    }
  })
}

// login: don10244096
// password: oybek1024_4096 || don1024_4096
//
// geocoder: 8fb635ed-f033-4166-8286-a5388bb7d9a9
// pointsearch: 90019ff7-9264-40fe-9cf3-00c7d41c1b92
//
//
//
// login: oybekmukhiddinov
// password: oybek10244096
//
// geocoder: 3e9a1241-7241-4975-b2a1-77203e9c0333
// pointsearch: a80458a5-709e-453d-831a-ae89e1db36a5

// login: islom0669
// password: islom06_69
// geocoder: 679a08be-aa49-4a79-ad31-80c65dda374a
// pointSearch: 586ceb0e-2504-440d-9972-997af51914d1

export { placeSearch, pointSearch }
