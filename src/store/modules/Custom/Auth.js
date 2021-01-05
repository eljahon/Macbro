import { ACCESS_TOKEN } from '@/store/mutation-types'
import request from '@/utils/request'
import storage from 'store'
const customUrl = 'v1/auth'
const auth = {
    state: {
      token: {},
      client_id: storage.get('client_id') || ''
    },
    getters: {
      getTokenInfo: state => state.token
    },
    mutations: {
        SET_TOKEN (state, payload) {
            state.token = payload
        },
        SET_CLIENT_ID (state, payload) {
          state.client_id = payload
        }
    },
    actions: {
    loginBySystemUser ({ commit }, data) {
        return new Promise((resolve, reject) => {
        request({
            url: customUrl + '/login/system-user',
            method: 'post',
            data: { login: data.login, password: data.password },
            headers: { 'client-id': data.client_id }
        })
          .then(result => {
            commit('SET_TOKEN', result.token.access_token)
            commit('SET_CLIENT_ID', result.token.client_id)
            storage.set(ACCESS_TOKEN, `${result.token.access_token}`)
            storage.set('refresh_token', result.token.refresh_token)
            storage.set('client_id', result.token.client_id)
            storage.set('user_id', result.token.user_id)
            storage.set('user_role_id', result.token.user_role_id)
            resolve(result)
        })
        .catch(error => {
          reject(error)
        })
      })
    },
    loginByTutor ({ commit }, data) {
        return new Promise((resolve, reject) => {
        request({
            url: customUrl + '/login/tutor',
            method: 'post',
            data: { login: data.login, password: data.password },
            headers: { 'client-id': data.client_id }
        })
          .then(result => {
            commit('SET_TOKEN', result.token.access_token)
            storage.set(ACCESS_TOKEN, result.token.access_token)
            storage.set('refresh_token', result.token.refresh_token)
            storage.set('client_id', result.token.client_id)
            storage.set('user_id', result.token.user_id)
            storage.set('user_role_id', result.token.user_role_id)
            resolve(result)
        })
        .catch(error => {
          reject(error)
        })
      })
    },
    confirmStudentOtp ({ commit }, data) {
      return new Promise((resolve, reject) => {
      request({
          url: customUrl + '/otp/confirm/student',
          method: 'post',
          data: data
      })
        .then(result => {
          // commit('SET_TOKEN', result.token)
          resolve(result)
      })
      .catch(error => {
        reject(error)
      })
    })
  },
  generateStudent ({ commit }, data) {
    return new Promise((resolve, reject) => {
    request({
        url: customUrl + '/otp/generate/student',
        method: 'post',
        data: data
    })
      .then(result => {
        // commit('SET_TOKEN', result.token)
        resolve(result)
    })
    .catch(error => {
      reject(error)
    })
  })
},
registerStudent ({ commit }, data) {
  return new Promise((resolve, reject) => {
  request({
      url: customUrl + '/register/student',
      method: 'post',
      data: data
  })
    .then(result => {
      // commit('SET_TOKEN', result.token)
      resolve(result)
  })
  .catch(error => {
    reject(error)
  })
})
},
refreshToken ({ commit }, data) {
  return new Promise((resolve, reject) => {
  request({
      url: customUrl + '/token/refresh',
      method: 'post',
      data: data
  })
    .then(result => {
      // commit('SET_TOKEN', result.token)
      resolve(result)
  })
  .catch(error => {
    reject(error)
  })
})
}

  }
}
  export default auth
