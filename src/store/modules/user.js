import storage from 'store'
// import { ACCESS_TOKEN, USER_ROLE } from '@/store/mutation-types'
import { ACCESS_TOKEN, REFRESH_TOKEN, USER_ROLE } from '@/store/mutation-types'
import { welcome } from '@/utils/util'
import request from '@/utils/request'
import { asyncRouterMap } from '@/config/router.config'

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
        const { login, password } = userInfo
        request({
          url: '/auth/login',
          method: 'post',
          data: { login, password },
          headers: { 'Content-Type': 'application/json' }
        })
        .then(res => {
          console.log('res', res)
          storage.set(USER_ROLE, res.role ? res.role : {})
          storage.set(ACCESS_TOKEN, res.access_token, 60 * 1000)
          storage.set(REFRESH_TOKEN, res.refresh_token, 60 * 1000)
          commit('SET_TOKEN', res.access_token)
          commit('SET_USERID', res.id)
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
        console.log('actions', actions)
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
        resolve(result)
    })
  },

    // 登出
    Logout ({ commit, state }) {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      console.log('Logout routers', asyncRouterMap)
      storage.remove(USER_ROLE)
      storage.remove(ACCESS_TOKEN)
    }

  }
}

export default user
