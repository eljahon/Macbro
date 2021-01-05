import request from '@/utils/request'
const customUrl = 'v1/group'
const gallery = {
    state: {
      groups: []
    },
    getters: {
      getGroup: state => state.groups
    },
    mutations: {
        SET_GROUPS (state, payload) {
            state.groups = payload
        }
    },
    actions: {
      getGroups ({ commit }, id) {
        return new Promise((resolve, reject) => {
        request({
            url: `${customUrl}?course_id=${id}`,
            method: 'get'
        })
          .then(result => {
          commit('SET_GROUPS', result.groups)
          resolve(result.groups)
        })
        .catch(error => {
          reject(error)
        })
      })
    },
    getGroup ({ commit }, id) {
      return new Promise((resolve, reject) => {
        request({
          url: customUrl + '/' + id
        }).then(res => {
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },
    postGroup ({ commit }, data) {
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
  updateGroup ({ commit }, data) {
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
  deleteGroup ({ commit }, id) {
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
