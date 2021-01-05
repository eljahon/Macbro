/* eslint-disable no-undef */
const users = {
    path: '/users',
    name: 'user',
    redirect: '/users/students',
    meta: { title: 'Пользователи', keepAlive: true, icon: 'user', permission: [ 'user' ] },
    children: [
      {
        path: '/users/students',
        name: 'students',
        component: () => import('../../custom/Users/Students'),
        meta: { title: 'Ученики', keepAlive: false, permission: [ 'user' ] }
      },
      {
        path: '/users/students/new',
        name: 'new-student',
        hidden: true,
        component: () => import('../../custom/Users/Students/Form'),
        meta: { title: 'Создать студента', keepAlive: false, permission: [ 'user' ] }
      },
      {
        path: '/users/students/:id',
        name: 'edit-student',
        hidden: true,
        component: () => import('../../custom/Users/Students/Form'),
        meta: { title: 'Редактировать студент', keepAlive: false, permission: [ 'user' ] }
      },
      {
        path: '/users/tutors',
        name: 'tutors',
        component: () => import('../../custom/Users/Tutors'),
        meta: { title: 'Учителя', keepAlive: false, permission: [ 'user' ] }
      },
      {
        path: '/users/tutors/new',
        name: 'new-tutor',
        hidden: true,
        component: () => import('../../custom/Users/Tutors/Form'),
        meta: { title: 'new Репетиторы', keepAlive: false, permission: [ 'user' ] }
      },
      {
        path: '/users/tutors/:id',
        name: 'edit-tutor',
        hidden: true,
        component: () => import('../../custom/Users/Tutors/Form'),
        meta: { title: 'edit Репетиторы', keepAlive: false, permission: [ 'user' ] }
      }
    ]
  }

export default users
