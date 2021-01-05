/* eslint-disable no-undef */
const profile = {
    path: '/profile',
    name: 'prf',
    hidden: true,
    redirect: '/profile/user',
    meta: { title: 'Profiles', keepAlive: true, icon: 'coffee', permission: [ 'profile' ] },
    children: [
      {
        path: '/profile/user',
        name: 'profiles',
        hidden: true,
        component: () => import('../../custom/Profile'),
        meta: { title: 'profile', keepAlive: true, icon: 'audit', permission: [ 'profile' ] }
      }
      // {
      //   path: '/profile/user',
      //   name: 'profile',
      //   component: { name: 'RouteView', render: (h) => h('router-view') },
      //   meta: { title: 'Profil', keepAlive: true, icon: 'audit', permission: [ 'dashboard' ] },
      //   redirect: '/profiles',
      //   children: [
      //     {
      //       path: '/profiles/another',
      //       name: 'another',
      //       component: () => import('../../custom/UI/EmptyComments.vue'),
      //       meta: { title: 'another', keepAlive: true, icon: 'audit', permission: [ 'dashboard' ] }
      //     }
      //   ]
      // }
    ]
  }

export default profile
