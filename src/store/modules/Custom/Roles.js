import request from '@/utils/request'
const customUrl = 'v1/user-role'
const roles = {
    state: {
      userRoles: {},
      user_types: [
        {
          name: 'System user',
          id: '2a1efd4a-d527-4cc2-adfa-a7546021f0f6'
        },
        {
          name: 'Tutor',
          id: '30d26793-9136-450a-9766-6e9776444c51'
        }
      ]
    },
    getters: {
      getUserRoles: state => state.userRoles,
      getUserTypes: state => state.user_types
    },
    mutations: {
        SET_USER_ROLES (state, payload) {
            state.userRoles = payload
        }
    },
    actions: {
        getUserRoles ({ commit }, clientId) {
        return new Promise((resolve, reject) => {
        request({
            url: customUrl,
            method: 'get',
            headers: { 'client-id': clientId }
        })
          .then(result => {
            resolve(result)
          commit('SET_USER_ROLES', result)
        })
        .catch(error => {
          reject(error)
        })
      })
    },
    getUserRole ({ commit }, id) {
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
    postUserRole ({ commit }, data) {
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
    updateUserRole ({ commit }, data) {
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
  deleteUserRole ({ commit }, id) {
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
  export default roles
