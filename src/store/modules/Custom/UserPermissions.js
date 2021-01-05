import request from '@/utils/request'
const customUrl = 'v1/user-role-permission'
const usr = {
    state: {
        user_role_permissions: []
    },
    getters: {
      getUrPermissions: state => state.user_role_permissions
    },
    mutations: {
        SET_UR_PERMISSIONS (state, payload) {
            state.user_role_permissions = payload
        }
    },
    actions: {
      getUserRolePermissions ({ commit }, id) {
        return new Promise((resolve, reject) => {
        request({
            url: customUrl + '/' + id,
            method: 'get'
        })
          .then(result => {
            resolve(result.user_role_permissions)
            commit('SET_UR_PERMISSIONS', result.user_role_permissions)
          }).catch(error => {
          reject(error)
        })
    })
    },
    getUserRolePermission ({ commit }, id) {
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
    postUserRolePermission ({ commit }, data) {
      return new Promise((resolve, reject) => {
      request({
          url: customUrl + '/' + data.user_role_id,
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
  updateUserRolePermission ({ commit }, data) {
    return new Promise((resolve, reject) => {
    request({
        url: customUrl + '/' + data.user_role_id + '/' + data.user_role_permission_id,
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
  deleteUserRolePermission ({ commit }, data) {
  return new Promise((resolve, reject) => {
    request({
        url: customUrl + '/' + data.user_role_id + '/' + data.user_role_permission_id,
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
  export default usr
