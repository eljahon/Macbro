/* eslint-disable no-undef */
const dashboard = {
    path: '/dashboard',
    name: 'dash',
    component: () => import('../../custom/Dashboard/Redirector.vue'),
    meta: { title: 'Dashboard', keepAlive: true, icon: ' ' }
  }

export default dashboard
