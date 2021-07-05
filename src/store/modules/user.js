import storage from 'store'
// import { ACCESS_TOKEN, USER_ROLE } from '@/store/mutation-types'
import { ACCESS_TOKEN, REFRESH_TOKEN, USER_ROLE } from '@/store/mutation-types'
import { welcome } from '@/utils/util'
import request from '@/utils/request'
// import { asyncRouterMap } from '@/config/router.config'
const baseUrl = process.env.VUE_APP_AUTH_URL

const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    info: {},
    userId: ''
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_USERID (state, id) {
      state.userId = id
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    }
  },
  actions: {
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        console.log(userInfo)
        const { username, password } = userInfo
        request({
          baseURL: `${baseUrl}`,
          url: '/auth/standard/login',
          method: 'post',
          data: { username, password },
          headers: { 'Content-Type': 'application/json' }
        })
        .then(res => {
          console.log('res', res.data)
          if (res && res.data) {
            storage.set(USER_ROLE, res.data.role ? res.data.role : {})
            storage.set(ACCESS_TOKEN, res.data.token.access_token, 60 * 1000)
            storage.set(REFRESH_TOKEN, res.data.token.refresh_token, 60 * 1000)
            commit('SET_TOKEN', res.data.token.access_token)
            storage.set('user_id', res.data.user.id)
            commit('SET_USERID', res.data.user.id)
          }
          resolve()
        })
        .catch(err => {
          console.error(err)
          // eslint-disable-next-line prefer-promise-reject-errors
          reject(new Error('Login failed'))
        })
      })
    },
    Refresh ({ commit }, token) {
      return new Promise((resolve, reject) => {
        console.log(token)
        request({
          baseURL: 'https://api.auth.macbro.uz/v1',
          url: '/auth/refresh',
          method: 'put',
          data: { refresh_token: token },
          headers: { 'Content-Type': 'application/json' }
        })
        .then(res => {
          console.log('res', res.data)
          if (res && res.data) {
            storage.set(ACCESS_TOKEN, res.data.access_token, 60 * 1000)
            storage.set(REFRESH_TOKEN, res.data.refresh_token, 60 * 1000)
            commit('SET_TOKEN', res.data.access_token)
          }
          resolve()
        })
        .catch(err => {
          console.error(err)
          // eslint-disable-next-line prefer-promise-reject-errors
          reject(new Error('Login failed'))
        })
      })
    },
    GetInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        var result = {}
        var roleObj = {}
        const actions = storage.get(USER_ROLE)
        // console.log('actions', actions)
        if (actions && actions.id) {
          roleObj = {
            'id': actions.id,
            'status': 1,
            'creatorId': 'system',
            'createTime': 1497160610259,
            'deleted': 0,
            // 'permissions': []
            'permissions': actions.permissions.map((act) => {
              return ({
                'roleId': actions.key,
                'permissionId': act.description,
                'permissionName': act.name,
                'actionEntitySet': [{
                          'action': 'add',
                          'defaultCheck': false
                        }, {
                          'action': 'query',
                          'defaultCheck': false
                        }, {
                          'action': 'get',
                          'defaultCheck': false
                        }, {
                          'action': 'update',
                          'defaultCheck': false
                        }, {
                          'action': 'delete',
                          'defaultCheck': false
                        }],
                'actionList': null,
                'dataAccess': null
              })
            })
          }
          result.role = roleObj
          if (result.role && result.role.permissions.length > 0) {
            const { role } = result
            role.permissions = result.role.permissions
            role.permissions.map(per => {
              if (per.actionEntitySet != null && per.actionEntitySet.length > 0) {
                const action = per.actionEntitySet.map(action => { return action.action })
                per.actionList = action
              }
            })
            role.permissionList = role.permissions.map(permission => { return permission.permissionId })
            // commit('SET_ROLES', result.role)
            // commit('SET_INFO', result)
          }
        } else {
          roleObj = {
            'id': actions.id,
            'status': 1,
            'creatorId': 'system',
            'createTime': 1497160610259,
            'deleted': 0,
            'permissions': []
          }
        }
        commit('SET_ROLES', result.role)
        commit('SET_INFO', result)
        commit('SET_NAME', { name: result.name, welcome: welcome() })
        commit('SET_AVATAR', result.avatar)
        const userId = storage.get('user_id')
        commit('SET_USERID', userId)
        resolve(result)
    })
  },

    // 登出
    Logout ({ commit, state }) {
      return new Promise((resolve, reject) => {
        // console.log(token)
        request({
          baseURL: 'https://api.auth.macbro.uz/v1',
          url: '/auth/logout',
          method: 'delete',
          headers: { 'Content-Type': 'application/json' }
        })
        .then(res => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          // console.log('Logout routers', asyncRouterMap)
          storage.remove(USER_ROLE)
          storage.remove(ACCESS_TOKEN)
          storage.remove(REFRESH_TOKEN)
          location.reload(true)
          resolve()
        })
        .catch(err => {
          console.error(err)
          // eslint-disable-next-line prefer-promise-reject-errors
          reject(new Error('Logout failed'))
        })
      })
    }

  }
}

export default user
