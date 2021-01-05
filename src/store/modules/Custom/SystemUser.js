import request from '@/utils/request'
const customUrl = 'v1/system-user'
const system = {
    state: {
        system_users: []
    },
    getters: {
      getSystemUser: state => state.system_users
    },
    mutations: {
        SET_SYSTEM_USER (state, payload) {
            state.system_users = payload
        }
    },
    actions: {
        getSystemUsers ({ commit }, params) {
        return new Promise((resolve, reject) => {
        request({
            url: customUrl,
            method: 'get',
            params
        })
          .then(result => {
            resolve(result)
          // commit('SET_SYSTEM_USER', result.system_users)
        })
        .catch(error => {
          reject(error)
        })
      })
    },
    getSystemUser ({ commit }, id) {
      return new Promise((resolve, reject) => {
      request({
          url: customUrl + '/' + id,
          method: 'get'
      })
        .then(result => {
          resolve(result.system_user)
      })
      .catch(error => {
        reject(error)
      })
    })
  },
    postSystemUser ({ commit }, data) {
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
    updateSystemUser ({ commit }, data) {
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
  deleteSystemUser ({ commit }, id) {
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
  export default system
