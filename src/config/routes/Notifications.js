/* eslint-disable no-undef */
const notify = {
    path: '/notification',
    name: 'notifications',
    redirect: '/notifications/forms',
    meta: { title: 'Уведомления', keepAlive: true, icon: 'notification', permission: [ 'notifications' ] },
    children: [
        {
            path: '/notifications/forms',
            name: 'forms',
            component: () => import('../../custom/CmsSettings/Forms'),
            meta: { title: 'Заявки', keepAlive: true, permission: [ 'notifications' ] }
            // meta: { title: 'cms.settings.forms', keepAlive: true, permission: [ 'dashboard' ] }
        }
    ]
  }

export default notify
