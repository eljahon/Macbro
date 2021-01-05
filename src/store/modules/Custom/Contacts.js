import request from '@/utils/request'
const customUrl = 'v1/contact'
const auth = {
    state: {
        contacts: {}
    },
    getters: {
      getContacts: state => state.contacts
    },
    mutations: {
        SET_CONTACTS (state, payload) {
            state.contacts = payload
        }
    },
    actions: {
    getContacts ({ commit }, data) {
        return new Promise((resolve, reject) => {
        request({
            url: customUrl,
            method: 'get'
        })
          .then(result => {
            commit('SET_CONTACTS', result.contacts[0])
            resolve(result.contacts[0])
        })
        .catch(error => {
          reject(error)
        })
      })
    },
    updateContact ({ commit }, data) {
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
    }
  }
}
  export default auth
