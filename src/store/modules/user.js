import storage from 'store'
import { logout } from '@/api/login'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { welcome } from '@/utils/util'

// function login () {
//   const value = {
//     username: 'admin',
//     password: '',
//     avatar: 'https://gw.alipayobjects.com/zos/rmsportal/jZUIxmJycoymBprLOUbT.png',
//     status: 1,
//     id: '0A9962db-D99B-78Cd-D5FC-aE9Ab879592E',
//     telephone: '',
//     lastLoginIp: '27.154.74.117',
//     lastLoginTime: 1534837621348,
//     creatorId: 'admin',
//     createTime: 1497160610259,
//     deleted: 0,
//     roleId: 'admin',
//     lang: 'ru-RU',
//     token: '4291d7da9005377ec9aec4a71ea837f'
//   }
//   return new Promise(function (resolve) {
//     setTimeout(resolve, 1000, value)
//   })
// }
// function getInfo () {
//   const profile = {
//     avatar: '/avatar2.jpg',
//     createTime: 1497160610259,
//     creatorId: 'admin',
//     deleted: 0,
//     id: '4291d7da9005377ec9aec4a71ea837f',
//     lastLoginIp: '27.154.74.117',
//     lastLoginTime: 1534837621348,
//     merchantCode: 'TLif2btpzg079h15bk',
//     name: 'Najot talim',
//     password: '',
//     role: {
//       createTime: 1497160610259,
//       creatorId: 'system',
//       deleted: 0,
//       describe: 'Access to all roles',
//       id: 'admin',
//       name: 'Director',
//       permissionList: [
//         'dashboard',
//         'exception',
//         'result',
//         'profile',
//         'table',
//         'form',
//         'order',
//         'permission',
//         'role',
//         'table',
//         'user',
//         'support'
//       ],
//       permissions: [
//         {
//         'roleId': 'admin',
//         'permissionId': 'dashboard',
//         'permissionName': '仪表盘',
//         'actions': '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
//         'actionEntitySet': [
//         {
//           'action': 'add',
//           'describe': '新增',
//           'defaultCheck': false
//         }, {
//           'action': 'query',
//           'describe': '查询',
//           'defaultCheck': false
//         }, {
//           'action': 'get',
//           'describe': '详情',
//           'defaultCheck': false
//         }, {
//           'action': 'update',
//           'describe': '修改',
//           'defaultCheck': false
//         }, {
//           'action': 'delete',
//           'describe': '删除',
//           'defaultCheck': false
//         }],
//         'actionList': null,
//         'dataAccess': null
//       }
      // {
      //   'roleId': 'admin',
      //   'permissionId': 'exception',
      //   'permissionName': '异常页面权限',
      //   'actions': '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
      //   'actionEntitySet': [{
      //     'action': 'add',
      //     'describe': '新增',
      //     'defaultCheck': false
      //   }, {
      //     'action': 'query',
      //     'describe': '查询',
      //     'defaultCheck': false
      //   }, {
      //     'action': 'get',
      //     'describe': '详情',
      //     'defaultCheck': false
      //   }, {
      //     'action': 'update',
      //     'describe': '修改',
      //     'defaultCheck': false
      //   }, {
      //     'action': 'delete',
      //     'describe': '删除',
      //     'defaultCheck': false
      //   }],
      //   'actionList': null,
      //   'dataAccess': null
      // }, {
      //   'roleId': 'admin',
      //   'permissionId': 'result',
      //   'permissionName': '结果权限',
      //   'actions': '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
      //   'actionEntitySet': [{
      //     'action': 'add',
      //     'describe': '新增',
      //     'defaultCheck': false
      //   }, {
      //     'action': 'query',
      //     'describe': '查询',
      //     'defaultCheck': false
      //   }, {
      //     'action': 'get',
      //     'describe': '详情',
      //     'defaultCheck': false
      //   }, {
      //     'action': 'update',
      //     'describe': '修改',
      //     'defaultCheck': false
      //   }, {
      //     'action': 'delete',
      //     'describe': '删除',
      //     'defaultCheck': false
      //   }],
      //   'actionList': null,
      //   'dataAccess': null
      // }, {
      //   'roleId': 'admin',
      //   'permissionId': 'profile',
      //   'permissionName': '详细页权限',
      //   'actions': '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
      //   'actionEntitySet': [{
      //     'action': 'add',
      //     'describe': '新增',
      //     'defaultCheck': false
      //   }, {
      //     'action': 'query',
      //     'describe': '查询',
      //     'defaultCheck': false
      //   }, {
      //     'action': 'get',
      //     'describe': '详情',
      //     'defaultCheck': false
      //   }, {
      //     'action': 'update',
      //     'describe': '修改',
      //     'defaultCheck': false
      //   }, {
      //     'action': 'delete',
      //     'describe': '删除',
      //     'defaultCheck': false
      //   }],
      //   'actionList': null,
      //   'dataAccess': null
      // }, {
      //   'roleId': 'admin',
      //   'permissionId': 'table',
      //   'permissionName': '表格权限',
      //   'actions': '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"import","defaultCheck":false,"describe":"导入"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"}]',
      //   'actionEntitySet': [{
      //     'action': 'add',
      //     'describe': '新增',
      //     'defaultCheck': false
      //   }, {
      //     'action': 'import',
      //     'describe': '导入',
      //     'defaultCheck': false
      //   }, {
      //     'action': 'get',
      //     'describe': '详情',
      //     'defaultCheck': false
      //   }, {
      //     'action': 'update',
      //     'describe': '修改',
      //     'defaultCheck': false
      //   }],
      //   'actionList': null,
      //   'dataAccess': null
      // }, {
      //   'roleId': 'admin',
      //   'permissionId': 'form',
      //   'permissionName': '表单权限',
      //   'actions': '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
      //   'actionEntitySet': [{
      //     'action': 'add',
      //     'describe': '新增',
      //     'defaultCheck': false
      //   }, {
      //     'action': 'get',
      //     'describe': '详情',
      //     'defaultCheck': false
      //   }, {
      //     'action': 'query',
      //     'describe': '查询',
      //     'defaultCheck': false
      //   }, {
      //     'action': 'update',
      //     'describe': '修改',
      //     'defaultCheck': false
      //   }, {
      //     'action': 'delete',
      //     'describe': '删除',
      //     'defaultCheck': false
      //   }],
      //   'actionList': null,
      //   'dataAccess': null
      // }, {
      //   'roleId': 'admin',
      //   'permissionId': 'order',
      //   'permissionName': '订单管理',
      //   'actions': '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
      //   'actionEntitySet': [{
      //     'action': 'add',
      //     'describe': '新增',
      //     'defaultCheck': false
      //   }, {
      //     'action': 'query',
      //     'describe': '查询',
      //     'defaultCheck': false
      //   }, {
      //     'action': 'get',
      //     'describe': '详情',
      //     'defaultCheck': false
      //   }, {
      //     'action': 'update',
      //     'describe': '修改',
      //     'defaultCheck': false
      //   }, {
      //     'action': 'delete',
      //     'describe': '删除',
      //     'defaultCheck': false
      //   }],
      //   'actionList': null,
      //   'dataAccess': null
      // }, {
      //   'roleId': 'admin',
      //   'permissionId': 'permission',
      //   'permissionName': '权限管理',
      //   'actions': '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
      //   'actionEntitySet': [{
      //     'action': 'add',
      //     'describe': '新增',
      //     'defaultCheck': false
      //   }, {
      //     'action': 'get',
      //     'describe': '详情',
      //     'defaultCheck': false
      //   }, {
      //     'action': 'update',
      //     'describe': '修改',
      //     'defaultCheck': false
      //   }, {
      //     'action': 'delete',
      //     'describe': '删除',
      //     'defaultCheck': false
      //   }],
      //   'actionList': null,
      //   'dataAccess': null
      // }, {
      //   'roleId': 'admin',
      //   'permissionId': 'role',
      //   'permissionName': '角色管理',
      //   'actions': '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
      //   'actionEntitySet': [{
      //     'action': 'add',
      //     'describe': '新增',
      //     'defaultCheck': false
      //   }, {
      //     'action': 'get',
      //     'describe': '详情',
      //     'defaultCheck': false
      //   }, {
      //     'action': 'update',
      //     'describe': '修改',
      //     'defaultCheck': false
      //   }, {
      //     'action': 'delete',
      //     'describe': '删除',
      //     'defaultCheck': false
      //   }],
      //   'actionList': null,
      //   'dataAccess': null
      // },
      // {
      //   'roleId': 'admin',
      //   'permissionId': 'table',
      //   'permissionName': '桌子管理',
      //   'actions': '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
      //   'actionEntitySet': [{
      //     'action': 'add',
      //     'describe': '新增',
      //     'defaultCheck': false
      //   }, {
      //     'action': 'get',
      //     'describe': '详情',
      //     'defaultCheck': false
      //   }, {
      //     'action': 'query',
      //     'describe': '查询',
      //     'defaultCheck': false
      //   }, {
      //     'action': 'update',
      //     'describe': '修改',
      //     'defaultCheck': false
      //   }, {
      //     'action': 'delete',
      //     'describe': '删除',
      //     'defaultCheck': false
      //   }],
      //   'actionList': null,
      //   'dataAccess': null
      // },
      // {
      //   'roleId': 'admin',
      //   'permissionId': 'user',
      //   'permissionName': '用户管理',
      //   'actions': '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"import","defaultCheck":false,"describe":"导入"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"},{"action":"export","defaultCheck":false,"describe":"导出"}]',
      //   'actionEntitySet': [{
      //     'action': 'add',
      //     'describe': '新增',
      //     'defaultCheck': false
      //   }, {
      //     'action': 'import',
      //     'describe': '导入',
      //     'defaultCheck': false
      //   }, {
      //     'action': 'get',
      //     'describe': '详情',
      //     'defaultCheck': false
      //   }, {
      //     'action': 'update',
      //     'describe': '修改',
      //     'defaultCheck': false
      //   }, {
      //     'action': 'delete',
      //     'describe': '删除',
      //     'defaultCheck': false
      //   }, {
      //     'action': 'export',
      //     'describe': '导出',
      //     'defaultCheck': false
      //   }],
      //   'actionList': null,
      //   'dataAccess': null
      // }
//     ],
//       status: 1
//     },
//     roleId: 'admin',
//     status: 1,
//     telephone: '',
//     username: 'admin'
//   }
//   return new Promise(function (resolve) {
//     setTimeout(resolve, 1000, { result: profile })
//   })
// }
const user = {
  state: {
    token: '',
    rolesList: storage.get('roleList') || [],
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    info: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    },
    SET_SYS_ROLES: (state, roles) => {
      state.rolesList = roles
      storage.set('roleList', roles)
    }
  },

  actions: {
    GetInfo ({ commit, state }) {
      return new Promise((resolve, reject) => {
        const roleList = storage.get('roleList')
        // console.log(state)
        const result = {
          avatar: '/avatar2.jpg',
          createTime: 1497160610259,
          creatorId: 'admin',
          deleted: 0,
          id: '4291d7da9005377ec9aec4a71ea837f',
          lastLoginIp: '27.154.74.117',
          lastLoginTime: 1534837621348,
          merchantCode: 'TLif2btpzg079h15bk',
          name: '天野远子',
          password: '',
          role: {}
        }
      const roleLister = {
        'id': 'admin',
        'status': 1,
        'creatorId': 'system',
        'createTime': 1497160610259,
        'deleted': 0,
        'permissions': roleList.map(res => ({
          ...res,
          actions: '',
          'roleId': 'admin',
          'actionList': null,
          'dataAccess': null,
          // 'permissionId': 'dashboard',
          'permissionId': res.permission_name,
          'permissionName': 'permission',
          'actionEntitySet': Object.keys(res.actions) ? Object.keys(res.actions).map(el => ({
            action: el,
            defaultCheck: false })
          ) : null
        }))
      }
      result.role = roleLister
      if (result.role && result.role.permissions.length > 0) {
        const role = result.role
        role.permissions = result.role.permissions
        role.permissions.map(per => {
          if (per.actionEntitySet != null && per.actionEntitySet.length > 0) {
            const action = per.actionEntitySet.map(action => { return action.action })
            per.actionList = action
          }
        })
        console.log(role)
        role.permissionList = role.permissions.map(permission => { return permission.permissionId })
        commit('SET_ROLES', result.role)
        commit('SET_INFO', result)
      } else {
        console.log('getInfo: roles must be a non-null array !')
      }
      commit('SET_NAME', { name: result.name, welcome: welcome() })
      commit('SET_AVATAR', result.avatar)
      resolve({ result })
    })
    },

    // 登出
    Logout ({ commit, state }) {
      return new Promise(resolve => {
        logout(state.token)
          .then(() => {
            resolve()
          })
          .catch(() => {
            resolve()
          })
          .finally(() => {
            commit('SET_TOKEN', '')
            commit('SET_ROLES', [])
            storage.remove(ACCESS_TOKEN)
            storage.remove('user_id')
            storage.remove('roleList')
            storage.remove('client_id')
            storage.remove('refresh_token')
            storage.remove('user_role_id')
            location.reload()
          })
      })
    }
  }
}

export default user
