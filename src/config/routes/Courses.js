/* eslint-disable no-undef */

const courses = {
    path: '/courses',
    name: 'courses',
    redirect: '/courses/job-list',
    meta: { title: 'courses', keepAlive: true, icon: 'folder-add', permission: [ 'course' ] },
    children: [
      {
        path: '/courses/categories',
        name: 'categories',
        component: () => import('../../custom/Courses/Categories'),
        meta: { title: 'courses.categories', keepAlive: true, icon: 'audit', permission: [ 'course' ] }
      },
      {
          path: '/courses/list',
          name: 'course-list',
          component: () => import('../../custom/Courses/Courses'),
          meta: { title: 'courses.courses', icon: 'audit', permission: [ 'course' ] }
      },
      {
        path: '/courses/groups',
        name: 'groups',
        component: () => import('../../custom/Courses/Groups'),
        meta: { title: 'Группы', keepAlive: true, icon: 'audit', permission: [ 'course' ] }
      },
      {
        path: '/courses/student-courses',
        name: 'student-courses',
        component: () => import('../../custom/Courses/StudentCourse'),
        meta: { title: 'Участники группы', keepAlive: true, icon: 'audit', permission: [ 'course' ] }
      },
      {
        path: '/courses/list/new',
        name: 'new-course',
        component: () => import('../../custom/Courses/Courses/CourseForm.vue'),
        hidden: true,
        meta: { title: 'Новый курс', keepAlive: false, icon: 'audit', permission: [ 'course' ] }
      },
      {
        path: '/courses/list/:id',
        name: 'edit-course',
        component: () => import('../../custom/Courses/Courses/CourseForm.vue'),
        hidden: true,
        meta: { title: 'edit course', icon: 'audit', permission: [ 'course' ] }
      },
      {
        path: '/courses/list/:id/chapter',
        name: 'chapters',
        exact: true,
        component: () => import('../../custom/Courses/Courses/Chapters.vue'),
        hidden: true,
        meta: { title: 'Глава', keepAlive: false, icon: 'audit', permission: [ 'course' ] }
      },
      {
        path: '/courses/list/:is/chapter/:id',
        name: 'job-lesson',
        exact: true,
        component: () => import('../../custom/Courses/Lessons'),
        hidden: true,
        meta: { title: 'courses.courses s', keepAlive: false, icon: 'audit', permission: [ 'course' ] }
      },
      {
        path: '/courses/list/:ic/chapter/:is/new',
        name: 'new-lecture',
        exact: true,
        component: () => import('../../custom/Courses/Lectures'),
        hidden: true,
        meta: { title: 'new Lecture', keepAlive: false, icon: 'audit', permission: [ 'course' ] }
      },
      {
        path: '/courses/list/:iw/chapter/:isa/lesson/:id',
        name: 'edit-lecture',
        exact: true,
        component: () => import('../../custom/Courses/Lectures'),
        hidden: true,
        meta: { title: 'edit Lecture', keepAlive: false, icon: 'audit', permission: [ 'course' ] }
      },
      {
        path: '/courses/list/:iw/chapter/:isa/lesson/:id/preview',
        name: 'preview-lecture',
        exact: true,
        component: () => import('../../custom/Courses/Lectures/View'),
        hidden: true,
        meta: { title: 'preview Lecture', keepAlive: false, icon: 'audit', permission: [ 'course' ] }
      },
      {
        path: '/courses/:idda/job/:id/preview',
        name: 'preview-lectures',
        component: () => import('../../custom/Courses/Lectures/Preview'),
        hidden: true,
        meta: { title: 'Preview', keepAlive: true, icon: 'audit', permission: [ 'course' ] }
      },
      {
        path: '/courses/groups/:id/new',
        name: 'new-groups',
        hidden: true,
        component: () => import('../../custom/Courses/Groups/Form'),
        meta: { title: 'new Группы', keepAlive: true, icon: 'audit', permission: [ 'course' ] }
      },
      {
        path: '/courses/groups/:id/edit',
        name: 'edit-groups',
        hidden: true,
        component: () => import('../../custom/Courses/Groups/Form'),
        meta: { title: 'edit Группы', keepAlive: true, icon: 'audit', permission: [ 'course' ] }
      }
      // {
      //   path: '/courses/certificates',
      //   name: 'certificates',
      //   component: () => import('../../custom/Courses/Certificates.vue'),
      //   meta: { title: 'courses.certificate', keepAlive: true, icon: 'audit', permission: [ 'dashboard' ] }
      // }
    ]
  }

export default courses
