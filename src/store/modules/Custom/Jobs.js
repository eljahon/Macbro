import request from '@/utils/request'

const jobs = {
    state: {
      jobs: []
    },
    getters: {
      getJobs: state => state.jobs
    },
    mutations: {
        SET_JOBS (state, payload) {
            state.jobs = payload
        }
    },
    actions: {
      getJobs ({ commit }, page) {
        return new Promise((resolve, reject) => {
        request({
            url: 'v1/job',
            method: 'get'
        })
          .then(result => {
          commit('SET_JOBS', result.jobs)
          resolve(result.jobs)
        })
        .catch(error => {
          reject(error)
        })
      })
    },
    getJob ({ commit }, id) {
      return new Promise((resolve, reject) => {
        request({
          url: 'v1/job/' + id
        }).then(res => {
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },
    postJob ({ commit }, data) {
      return new Promise((resolve, reject) => {
      request({
          url: 'v1/job',
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
  updateJob ({ commit }, data) {
    return new Promise((resolve, reject) => {
    request({
        url: 'v1/job/' + data.id,
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
  deleteJob ({ commit }, id) {
  return new Promise((resolve, reject) => {
    request({
        url: 'v1/job/' + id,
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
  export default jobs
