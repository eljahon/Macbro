/* eslint-disable no-undef */
const content = {
  path: '/cms-settings',
  name: 'cmsSettings',
  redirect: '/cms-settings/team',
  meta: { title: 'cms.settings', keepAlive: true, icon: 'desktop', permission: [ 'cms' ] },
  children: [
    {
      path: '/cms-settings/enrolled/list',
      name: 'enrolls',
      component: () => import('../../custom/CmsSettings/EnrolledStudents'),
      meta: { title: 'Выпускники', keepAlive: false, permission: [ 'cms' ] }
    },
    {
      path: '/cms-settings/teacher',
      name: 'teacher',
      component: () => import('../../custom/CmsSettings/Teachers'),
      meta: { title: 'Учителя', keepAlive: true, permission: [ 'cms' ] }
    },
    // {
    //   path: '/cms-settings/team',
    //   name: 'team',
    //   component: () => import('../../custom/CmsSettings/Team/Team.vue'),
    //   meta: { title: 'cms.settings.Team', keepAlive: true, permission: [ 'dashboard' ] }
    // },
    {
      path: '/cms-settings/about-us/features/new',
      name: 'new-feature',
      hidden: true,
      component: () => import('../../custom/CmsSettings/AboutUs/Directions/Form'),
      meta: { title: 'new feature', keepAlive: true, permission: [ 'cms' ] }
    },
    {
      path: '/cms-settings/about-us/features/:id',
      name: 'edit-feature',
      hidden: true,
      component: () => import('../../custom/CmsSettings/AboutUs/Directions/Form'),
      meta: { title: 'edit feature', keepAlive: false, permission: [ 'cms' ] }
    },
    {
      path: '/cms-settings/about-us/offers/new',
      name: 'new-offers',
      hidden: true,
      component: () => import('../../custom/CmsSettings/AboutUs/Offers/Form'),
      meta: { title: 'new offers', keepAlive: false, permission: [ 'cms' ] }
    },
    {
      path: '/cms-settings/about-us/offers/:id',
      name: 'edit-offer',
      hidden: true,
      component: () => import('../../custom/CmsSettings/AboutUs/Offers/Form'),
      meta: { title: 'edit offer', keepAlive: false, permission: [ 'cms' ] }
    },
    {
      path: '/cms-settings/enrolled/new',
      name: 'new-enroll',
      hidden: true,
      component: () => import('../../custom/CmsSettings/EnrolledStudents/Form'),
      meta: { title: 'New student', keepAlive: false, permission: [ 'cms' ] }
    },
    {
      path: '/cms-settings/enrolled/:id',
      name: 'edit-enroll',
      hidden: true,
      component: () => import('../../custom/CmsSettings/EnrolledStudents/Form'),
      meta: { title: 'Edit student', keepAlive: false, permission: [ 'cms' ] }
    },
    {
      path: '/cms-settings/clients',
      name: 'clients',
      component: () => import('../../custom/CmsSettings/Clients'),
      meta: { title: 'Клиенты', keepAlive: true, permission: [ 'cms' ] }
    },
    {
      path: '/cms-settings/clients/new',
      name: 'new-clients',
      hidden: true,
      component: () => import('../../custom/CmsSettings/Clients/Form'),
      meta: { title: 'Редактировать клиента', keepAlive: true, permission: [ 'cms' ] }
    },
    {
      path: '/cms-settings/clients/:id',
      name: 'edit-clients',
      hidden: true,
      component: () => import('../../custom/CmsSettings/Clients/Form'),
      meta: { title: 'Новый клиент', keepAlive: false, permission: [ 'cms' ] }
    },
    {
      path: '/cms-settings/teacher/new',
      name: 'new-teacher',
      hidden: true,
      component: () => import('../../custom/CmsSettings/Teachers/Form'),
      meta: { title: 'Новый учитель', keepAlive: true, permission: [ 'cms' ] }
    },
    {
      path: '/cms-settings/teacher/:id',
      name: 'edit-teacher',
      hidden: true,
      component: () => import('../../custom/CmsSettings/Teachers/Form'),
      meta: { title: 'Редактировать учителя', keepAlive: true, permission: [ 'cms' ] }
    },
    {
      path: '/cms-settings/parners',
      name: 'Partners',
      component: () => import('../../custom/CmsSettings/Partners/Partners.vue'),
      meta: { title: 'cms.settings.partners', keepAlive: true, permission: [ 'cms' ] }
    },
    {
      path: '/cms-settings/about-us',
      name: 'AboutUs',
      component: () => import('../../custom/CmsSettings/AboutUs/AboutUs.vue'),
      meta: { title: 'cms.settings.about', keepAlive: true, permission: [ 'cms' ] }
    },
    {
      path: '/courses/tariffs',
      name: 'tariffs',
      component: () => import('../../custom/Courses/Tariffs'),
      meta: { title: 'courses.tariff', keepAlive: true, icon: 'audit', permission: [ 'cms' ] }
    },
    {
      path: '/courses/tariffs/new',
      name: 'new-tariffs',
      hidden: true,
      component: () => import('../../custom/Courses/Tariffs/Form'),
      meta: { title: 'new Tariff', keepAlive: true, icon: 'audit', permission: [ 'cms' ] }
    },
    {
      path: '/courses/tariffs/:id',
      name: 'edit-tariffs',
      hidden: true,
      component: () => import('../../custom/Courses/Tariffs/Form'),
      meta: { title: 'edit Tariff', keepAlive: false, icon: 'audit', permission: [ 'cms' ] }
    },
    {
      path: '/courses/job-list',
      name: 'job-list',
      component: () => import('../../custom/Courses/Jobs'),
      meta: { title: 'courses.job', keepAlive: true, icon: 'audit', permission: [ 'cms' ] }
    },
    {
      path: '/courses/job-list/new',
      name: 'new-job',
      component: () => import('../../custom/Courses/Jobs/NewJob.vue'),
      hidden: true,
      meta: { title: 'New job', keepAlive: true, icon: 'audit', permission: [ 'cms' ] }
    },
    {
      path: '/courses/job-list/:id',
      name: 'edit-job',
      component: () => import('../../custom/Courses/Jobs/NewJob.vue'),
      hidden: true,
      meta: { title: 'Edit', keepAlive: true, icon: 'audit', permission: [ 'cms' ] }
    }
  ]
}

export default content
