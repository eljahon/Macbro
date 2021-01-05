import request from '@/utils/request'
const customUrl = 'v1/permission'
const partners = {
    state: {
        permissions: []
    },
    getters: {
      getPermissions: state => state.permissions
    },
    mutations: {
        SET_PERMISSIONS (state, payload) {
            state.permissions = payload
        }
    },
    actions: {
      getPermissions ({ commit }) {
        return new Promise((resolve, reject) => {
        request({
            url: customUrl,
            method: 'get'
        })
          .then(result => {
            resolve(result.permissions)
          commit('SET_PERMISSIONS', result.permissions)
        })
        .catch(error => {
          reject(error)
        })
      })
    },
    getPermission ({ commit }, id) {
      return new Promise((resolve, reject) => {
      request({
          url: customUrl + '/' + id,
          method: 'get'
      })
        .then(result => {
          resolve(result.permission)
      //   commit('SET_JOBS', result.jobs)
      })
      .catch(error => {
        reject(error)
      })
    })
  },
    postPermission ({ commit }, data) {
        return new Promise((resolve, reject) => {
        request({
            url: customUrl,
            method: 'post',
            data
        })
          .then(result => {
            resolve(result)
        })
        .catch(error => {
          reject(error)
        })
      })
    },
    updatePermission ({ commit }, data) {
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
  deletePermission ({ commit }, id) {
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
