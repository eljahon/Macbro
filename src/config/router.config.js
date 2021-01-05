// eslint-disable-next-line
import { UserLayout, BasicLayout, BlankLayout } from '@/layouts'
// import { bxAnaalyse } from '@/core/icons'
import children from './routes'
// console.log(Blogs)
// const RouteView = {
//   name: 'RouteView',
//   render: (h) => h('router-view')
// }

export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: 'Главный' },
    redirect: '/dashboard',
    children

      // dashboard
      // {
      //   path: '/dashboard',
      //   name: 'dashboard',
      //   redirect: '/dashboard/workplace',
      //   component: RouteView,
      //   meta: { title: 'menu.dashboard', keepAlive: true, icon: bxAnaalyse, permission: [ 'dashboard' ] },
      //   children: [
      //     {
      //       path: '/dashboard/analysis/:pageNo([1-9]\\d*)?',
      //       name: 'Analysis',
      //       component: () => import('@/views/dashboard/Analysis'),
      //       meta: { title: 'menu.dashboard.analysis', keepAlive: false, permission: [ 'dashboard' ] }
      //     },
      //     {
      //       path: '/dashboard/workplace',
      //       name: 'Workplace',
      //       component: () => import('@/views/dashboard/Workplace'),
      //       meta: { title: 'menu.dashboard.workplace', keepAlive: true, permission: [ 'dashboard' ] }
      //     }
      //   ]
      // },
      // {
      //   path: '/blogs',
      //   name: 'blogs',
      //   redirect: '/blogs/posts',
      //   component: RouteView,
      //   meta: { title: 'Blogs', keepAlive: true, icon: 'food', permission: [ 'dashboard' ] },
      //   children: [
      //     {
      //       path: '/blogs/posts',
      //       name: 'posts',
      //       component: () => import('../custom/Blogs/posts/Allposts.vue'),
      //       meta: { title: 'All posts', keepAlive: true, icon: 'audit', permission: [ 'dashboard' ] }
      //     },
      //     {
      //       path: '/blogs/posts/new-post',
      //       name: 'post-new',
      //       hidden: true,
      //       component: () => import('../custom/Blogs/posts/Create/CreatePost.vue'),
      //       meta: { title: 'New post', keepAlive: true, icon: 'audit', permission: [ 'dashboard' ] }
      //     },
      //     {
      //       path: '/blogs/comments',
      //       name: 'comments',
      //       component: () => import('../custom/Blogs/comments/Comments.vue'),
      //       meta: { title: 'Comments', keepAlive: true, icon: 'message', permission: [ 'dashboard' ] }
      //     },
      //     {
      //       path: '/blogs/settings',
      //       name: 'settings',
      //       component: () => import('../custom/Blogs/Settings/Settings.vue'),
      //       meta: { title: 'Settings', keepAlive: true, icon: 'setting', permission: [ 'dashboard' ] }
      //     }
      //   ]
      // }

      // forms
      // {
      //   path: '/form',
      //   redirect: '/form/base-form',
      //   component: RouteView,
      //   meta: { title: 'Forms bases', icon: 'form', permission: [ 'form' ] },
      //   children: [
      //     {
      //       path: '/form/base-form',
      //       name: 'BaseForm',
      //       component: () => import('@/views/form/basicForm'),
      //       meta: { title: '基础表单', keepAlive: true, permission: [ 'form' ] }
      //     },
      //     {
      //       path: '/form/step-form',
      //       name: 'StepForm',
      //       component: () => import('@/views/form/stepForm/StepForm'),
      //       meta: { title: '分步表单', keepAlive: true, permission: [ 'form' ] }
      //     },
      //     {
      //       path: '/form/advanced-form',
      //       name: 'AdvanceForm',
      //       component: () => import('@/views/form/advancedForm/AdvancedForm'),
      //       meta: { title: '高级表单', keepAlive: true, permission: [ 'form' ] }
      //     }
      //   ]
      // }

      // // list
      // {
      //   path: '/list',
      //   name: 'list',
      //   component: RouteView,
      //   redirect: '/list/table-list',
      //   meta: { title: 'Tables', icon: 'table', permission: [ 'table' ] },
      //   children: [
      //     {
      //       path: '/list/table-list/:pageNo([1-9]\\d*)?',
      //       name: 'TableListWrapper',
      //       hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
      //       component: () => import('@/views/list/TableList'),
      //       meta: { title: '查询表格', keepAlive: true, permission: [ 'table' ] }
      //     },
      //     {
      //       path: '/list/basic-list',
      //       name: 'BasicList',
      //       component: () => import('@/views/list/BasicList'),
      //       meta: { title: '标准列表', keepAlive: true, permission: [ 'table' ] }
      //     },
      //     {
      //       path: '/list/card',
      //       name: 'CardList',
      //       component: () => import('@/views/list/CardList'),
      //       meta: { title: '卡片列表', keepAlive: true, permission: [ 'table' ] }
      //     },
      //     {
      //       path: '/list/search',
      //       name: 'SearchList',
      //       component: () => import('@/views/list/search/SearchLayout'),
      //       redirect: '/list/search/article',
      //       meta: { title: '搜索列表', keepAlive: true, permission: [ 'table' ] },
      //       children: [
      //         {
      //           path: '/list/search/article',
      //           name: 'SearchArticles',
      //           component: () => import('../views/list/search/Article'),
      //           meta: { title: 'projects', permission: [ 'table' ] }
      //         },
      //         {
      //           path: '/list/search/project',
      //           name: 'SearchProjects',
      //           component: () => import('../views/list/search/Projects'),
      //           meta: { title: 'projects', permission: [ 'table' ] }
      //         },
      //         {
      //           path: '/list/search/application',
      //           name: 'SearchApplications',
      //           component: () => import('../views/list/search/Applications'),
      //           meta: { title: 'projects', permission: [ 'table' ] }
      //         }
      //       ]
      //     }
      //   ]
      // },

      // profile
      // {
      //   path: '/profile',
      //   name: 'profile',
      //   component: RouteView,
      //   redirect: '/profile/basic',
      //   meta: { title: '详情页', icon: 'profile', permission: [ 'profile' ] },
      //   children: [
      //     {
      //       path: '/profile/basic',
      //       name: 'ProfileBasic',
      //       component: () => import('@/views/profile/basic'),
      //       meta: { title: '基础详情页', permission: [ 'profile' ] }
      //     },
      //     {
      //       path: '/profile/advanced',
      //       name: 'ProfileAdvanced',
      //       component: () => import('@/views/profile/advanced/Advanced'),
      //       meta: { title: '高级详情页', permission: [ 'profile' ] }
      //     }
      //   ]
      // },

      // // result
      // {
      //   path: '/result',
      //   name: 'result',
      //   component: RouteView,
      //   redirect: '/result/success',
      //   meta: { title: '结果页', icon: 'check-circle-o', permission: [ 'result' ] },
      //   children: [
      //     {
      //       path: '/result/success',
      //       name: 'ResultSuccess',
      //       component: () => import(/* webpackChunkName: "result" */ '@/views/result/Success'),
      //       meta: { title: '成功', keepAlive: false, hiddenHeaderContent: true, permission: [ 'result' ] }
      //     },
      //     {
      //       path: '/result/fail',
      //       name: 'ResultFail',
      //       component: () => import(/* webpackChunkName: "result" */ '@/views/result/Error'),
      //       meta: { title: '失败', keepAlive: false, hiddenHeaderContent: true, permission: [ 'result' ] }
      //     }
      //   ]
      // },

      // // Exception
      // {
      //   path: '/exception',
      //   name: 'exception',
      //   component: RouteView,
      //   redirect: '/exception/403',
      //   meta: { title: '异常页', icon: 'warning', permission: [ 'exception' ] },
      //   children: [
      //     {
      //       path: '/exception/403',
      //       name: 'Exception403',
      //       component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/403'),
      //       meta: { title: '403', permission: [ 'exception' ] }
      //     },
      //     {
      //       path: '/exception/404',
      //       name: 'Exception404',
      //       component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404'),
      //       meta: { title: '404', permission: [ 'exception' ] }
      //     },
      //     {
      //       path: '/exception/500',
      //       name: 'Exception500',
      //       component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/500'),
      //       meta: { title: '500', permission: [ 'exception' ] }
      //     }
      //   ]
      // },

      // account
      // {
      //   path: '/account',
      //   component: RouteView,
      //   redirect: '/account/center',
      //   name: 'account',
      //   meta: { title: '个人页', icon: 'user', keepAlive: true, permission: [ 'user' ] },
      //   children: [
      //     {
      //       path: '/account/center',
      //       name: 'center',
      //       component: () => import('@/views/account/center'),
      //       meta: { title: '个人中心', keepAlive: true, permission: [ 'user' ] }
      //     },
      //     {
      //       path: '/account/settings',
      //       name: 'settings',
      //       component: () => import('@/views/account/settings/Index'),
      //       meta: { title: '个人设置', hideHeader: true, permission: [ 'user' ] },
      //       redirect: '/account/settings/base',
      //       hideChildrenInMenu: true,
      //       children: [
      //         {
      //           path: '/account/settings/base',
      //           name: 'BaseSettings',
      //           component: () => import('@/views/account/settings/BaseSetting'),
      //           meta: { title: '基本设置', hidden: true, permission: [ 'user' ] }
      //         },
      //         {
      //           path: '/account/settings/security',
      //           name: 'SecuritySettings',
      //           component: () => import('@/views/account/settings/Security'),
      //           meta: { title: '安全设置', hidden: true, keepAlive: true, permission: [ 'user' ] }
      //         },
      //         {
      //           path: '/account/settings/custom',
      //           name: 'CustomSettings',
      //           component: () => import('@/views/account/settings/Custom'),
      //           meta: { title: '个性化设置', hidden: true, keepAlive: true, permission: [ 'user' ] }
      //         },
      //         {
      //           path: '/account/settings/binding',
      //           name: 'BindingSettings',
      //           component: () => import('@/views/account/settings/Binding'),
      //           meta: { title: '账户绑定', hidden: true, keepAlive: true, permission: [ 'user' ] }
      //         },
      //         {
      //           path: '/account/settings/notification',
      //           name: 'NotificationSettings',
      //           component: () => import('@/views/account/settings/Notification'),
      //           meta: { title: '新消息通知', hidden: true, keepAlive: true, permission: [ 'user' ] }
      //         }
      //       ]
      //     }
      //   ]
      // }
  },
  {
    path: '*', redirect: '/404', hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
      },
      {
        path: 'recover',
        name: 'recover',
        component: undefined
      }
    ]
  },

  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }

]
