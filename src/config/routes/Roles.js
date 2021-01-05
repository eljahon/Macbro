/* eslint-disable no-undef */
const roles = {
    path: '/role-permission',
    name: 'setting',
    redirect: '/role-permission/roles',
    meta: { title: 'Управление доступом', keepAlive: true, icon: 'file-protect', permission: [ 'roles' ] },
    children: [
      {
        path: '/role-permission/roles',
        name: 'roles',
        component: () => import('../../custom/RolesAndPermissions/Roles'),
        meta: { title: 'Роли', keepAlive: false, permission: [ 'roles' ] }
      },
      {
        path: '/role-permission/roles/new',
        name: 'role-new',
        hidden: true,
        component: () => import('../../custom/RolesAndPermissions/Roles/Form'),
        meta: { title: 'Роли new', keepAlive: false, permission: [ 'roles' ] }
      },
      {
        path: '/role-permission/roles/:id',
        name: 'role-edit',
        hidden: true,
        component: () => import('../../custom/RolesAndPermissions/Roles/Form'),
        meta: { title: 'Роли edit', keepAlive: false, permission: [ 'roles' ] }
      },
      {
        path: '/role-permission/roles/:id/user-permission',
        name: 'role-permission',
        hidden: true,
        component: () => import('../../custom/RolesAndPermissions/UserPermissions/Roling.vue'),
        meta: { title: 'user-permission', keepAlive: false, permission: [ 'roles' ] }
      },
      {
        path: '/role-permission/permissions',
        name: 'permissions',
        component: () => import('../../custom/RolesAndPermissions/Permissions'),
        meta: { title: 'Разрешения', keepAlive: false, permission: [ 'roles' ] }
      },
      {
        path: '/role-permission/permissions/new',
        name: 'permissions-new',
        hidden: true,
        component: () => import('../../custom/RolesAndPermissions/Permissions/Form'),
        meta: { title: 'Разрешения new', keepAlive: false, permission: [ 'roles' ] }
      },
      {
        path: '/role-permission/permissions/:id',
        name: 'permissions-edit',
        hidden: true,
        component: () => import('../../custom/RolesAndPermissions/Permissions/Form'),
        meta: { title: 'Разрешения edit', keepAlive: false, permission: [ 'roles' ] }
      },
      {
        path: '/users/system-user',
        name: 'system-user',
        component: () => import('../../custom/Users/SystemUsers'),
        meta: { title: 'Пользователи', keepAlive: false, permission: [ 'roles' ] }
      },
      {
        path: '/users/system-user/new',
        name: 'system-user-create',
        hidden: true,
        component: () => import('../../custom/Users/SystemUsers/Form'),
        meta: { title: 'System user new', keepAlive: false, permission: [ 'roles' ] }
      },
      {
        path: '/users/system-user/:id',
        name: 'system-user-edit',
        hidden: true,
        component: () => import('../../custom/Users/SystemUsers/Form'),
        meta: { title: 'System user edit', keepAlive: false, permission: [ 'roles' ] }
      }
    ]
  }

export default roles
