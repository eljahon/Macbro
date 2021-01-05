/* eslint-disable no-undef */
const blogs = {
        path: '/blogs',
        name: 'blogs',
        redirect: '/blogs/posts',
        meta: { title: 'blogs', keepAlive: true, icon: 'coffee', permission: [ 'blog' ] },
        children: [
          {
            path: '/blogs/posts',
            name: 'posts',
            component: () => import('../../custom/Blogs/posts/Allposts.vue'),
            meta: { title: 'blogs.posts', keepAlive: true, icon: 'audit', permission: [ 'blog' ] }
          },
          {
            path: '/blogs/posts/new-post',
            name: 'post-new',
            hidden: true,
            component: () => import('../../custom/Blogs/posts/Create/CreatePost.vue'),
            meta: { title: 'New post', keepAlive: true, icon: 'audit', permission: [ 'blog' ] }
          },
          {
            path: '/blogs/posts/:id',
            name: 'edit-new',
            hidden: true,
            component: () => import('../../custom/Blogs/posts/Create/CreatePost.vue'),
            meta: { title: 'Edit post', keepAlive: true, icon: 'audit', permission: [ 'blog' ] }
          },
          {
            path: '/blogs/videos/list',
            name: 'video',
            component: () => import('../../custom/Blogs/video/VideoContent.vue'),
            meta: { title: 'blogs.videos', keepAlive: true, icon: 'play-circle', permission: [ 'blog' ] }
          },
          {
            path: '/blogs/videos/list/new',
            name: 'new-video',
            hidden: true,
            component: () => import('../../custom/Blogs/video/AddNewVideo.vue'),
            meta: { title: 'blogs.videos', keepAlive: true, icon: 'play-circle', permission: [ 'blog' ] }
          },
          {
            path: '/blogs/videos/list/:id',
            name: 'edit-video',
            hidden: true,
            component: () => import('../../custom/Blogs/video/AddNewVideo.vue'),
            meta: { title: 'blogs.videos', keepAlive: false, icon: 'play-circle', permission: [ 'blog' ] }
          },
          // {
          //   path: '/blogs/comments',
          //   name: 'comments',
          //   component: () => import('../../custom/Blogs/comments/Comments.vue'),
          //   meta: { title: 'blogs.comments', keepAlive: true, icon: 'message', permission: [ 'dashboard' ] }
          // },
          {
            path: '/blogs/settings',
            name: 'settings',
            component: () => import('../../custom/Blogs/Settings/Settings.vue'),
            meta: { title: 'blogs.settings', keepAlive: false, icon: 'setting', permission: [ 'blog' ] }
          }
        ]
      }

export default blogs
