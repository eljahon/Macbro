import request from '@/utils/request'
const customUrl = 'v1/partner'
const partners = {
    state: {
      partners: []
    },
    getters: {
      getPartners: state => state.partners
    },
    mutations: {
        SET_PARTNER (state, payload) {
            state.partners = payload
        }
    },
    actions: {
      getPartners ({ commit }) {
        return new Promise((resolve, reject) => {
        request({
            url: customUrl,
            method: 'get'
        })
          .then(result => {
            resolve(result.partners)
          commit('SET_PARTNER', result.partners)
        })
        .catch(error => {
          reject(error)
        })
      })
    },
    getPartner ({ commit }, id) {
      return new Promise((resolve, reject) => {
      request({
          url: customUrl + id,
          method: 'get'
      })
        .then(result => {
          resolve(result)
      //   commit('SET_JOBS', result.jobs)
      })
      .catch(error => {
        reject(error)
      })
    })
  },
    postPartner ({ commit }) {
        return new Promise((resolve, reject) => {
        request({
            url: customUrl,
            method: 'post'
        })
          .then(result => {
            resolve(result)
        })
        .catch(error => {
          reject(error)
        })
      })
    },
    updatePartner ({ commit }, data) {
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
  deletePartner ({ commit }, id) {
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
  export default partners
