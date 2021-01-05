import request from '@/utils/request'
const customUrl = 'v1/about'
const about = {
    state: {
      about: []
    },
    getters: {
      getAbout: state => state.about
    },
    mutations: {
        SET_ABOUT (state, payload) {
            state.about = payload
        }
    },
    actions: {
      getAbouts ({ commit }) {
        return new Promise((resolve, reject) => {
        request({
            url: customUrl,
            method: 'get'
        })
          .then(result => {
          commit('SET_ABOUT', result.abouts)
          resolve(result.abouts)
        })
        .catch(error => {
          reject(error)
        })
      })
    },
    getAbout ({ commit }, id) {
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
    postAbout ({ commit }, data) {
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
  updateAbout ({ commit }, data) {
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
  deleteAbout ({ commit }, id) {
  return new Promise((resolve, reject) => {
    request({
        url: customUrl + id,
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
  export default about
