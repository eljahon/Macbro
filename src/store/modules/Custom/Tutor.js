import request from '@/utils/request'
const customUrl = 'v1/tutor'
const tutors = {
    state: {
      tutors: []
    },
    getters: {
      getTutors: state => state.tutors
    },
    mutations: {
        SET_TUTOR (state, payload) {
            state.tutors = payload
        }
    },
    actions: {
      getTutors ({ commit }, params) {
        return new Promise((resolve, reject) => {
        request({
            url: customUrl,
            method: 'get',
            params
        })
          .then(result => {
            resolve(result)
          commit('SET_TUTOR', result.tutors)
        })
        .catch(error => {
          reject(error)
        })
      })
    },
    getTutor ({ commit }, id) {
      return new Promise((resolve, reject) => {
      request({
          url: customUrl + '/' + id,
          method: 'get'
      })
        .then(result => {
          resolve(result)
      })
      .catch(error => {
        reject(error)
      })
    })
  },
    postTutor ({ commit }, data) {
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
    updateTutor ({ commit }, data) {
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
  deleteTutor ({ commit }, id) {
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
  export default tutors
