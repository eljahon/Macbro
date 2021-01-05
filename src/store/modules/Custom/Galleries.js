import request from '@/utils/request'
const customUrl = 'v1/gallery'
const gallery = {
    state: {
      gallery: []
    },
    getters: {
      getGallery: state => state.gallery
    },
    mutations: {
        SET_GALLERY (state, payload) {
            state.gallery = payload
        }
    },
    actions: {
      getGalleries ({ commit }) {
        return new Promise((resolve, reject) => {
        request({
            url: customUrl,
            method: 'get'
        })
          .then(result => {
          commit('SET_GALLERY', result.galleries)
          resolve(result.galleries)
        })
        .catch(error => {
          reject(error)
        })
      })
    },
    getGallery ({ commit }, id) {
      return new Promise((resolve, reject) => {
        request({
          url: customUrl + id
        }).then(res => {
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },
    postGallery ({ commit }, data) {
      return new Promise((resolve, reject) => {
      request({
          url: customUrl,
          method: 'post',
          data: data
      })
        .then(result => {
        resolve(result)
      })
      .catch(error => {
        reject(error)
      })
    })
  },
  updateGallery ({ commit }, data) {
    return new Promise((resolve, reject) => {
    request({
        url: customUrl + '/' + data.id,
        method: 'put',
        data: data
    })
      .then(result => {
      resolve(result)
    })
    .catch(error => {
      reject(error)
    })
  })
},
  deleteGallery ({ commit }, id) {
  return new Promise((resolve, reject) => {
    request({
        url: customUrl + '/' + id,
        method: 'delete'
    })
      .then(result => {
      resolve(result)
    })
    .catch(error => {
      reject(error)
    })
  })
}
  }
}
  export default gallery
