import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'
import user from './modules/user'

// default router permission control
import permission from './modules/permission'

import getters from './getters'
// dynamic router permission control (Experimental)
// import permission from './modules/async-router'
import Auth from './modules/Custom/Auth'
import Jobs from './modules/Custom/Jobs'
import Posts from './modules/Custom/Posts'
import About from './modules/Custom/About'
import Tutor from './modules/Custom/Tutor'
import Roles from './modules/Custom/Roles'
import Forms from './modules/Custom/Forms'
import Video from './modules/Custom/Video'
import Groups from './modules/Custom/Groups'
import Courses from './modules/Custom/Courses'
import Tariffs from './modules/Custom/Tariffs'
import Clients from './modules/Custom/Clients'
import Lessons from './modules/Custom/Lessons'
import Features from './modules/Custom/Features'
import Contacts from './modules/Custom/Contacts'
import Partners from './modules/Custom/Partners'
import Students from './modules/Custom/Students'
import Chapters from './modules/Custom/Chapters'
import Teachers from './modules/Custom/Teachers'
import VideoInfo from './modules/Custom/VideoInfo'
import Galleries from './modules/Custom/Galleries'
import Languages from './modules/Custom/Languages'
import Advantage from './modules/Custom/Advantage'
import Categories from './modules/Custom/Categories'
import SystemUser from './modules/Custom/SystemUser'
import Permissions from './modules/Custom/Permissions'
import StudentCourses from './modules/Custom/StudentCourses'
import BlogCategories from './modules/Custom/BlogCategories'
import FeatureStudents from './modules/Custom/FeatureStudents'
import UserRolePermissions from './modules/Custom/UserPermissions'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    user,
    Auth,
    Jobs,
    Posts,
    Forms,
    About,
    Tutor,
    Roles,
    Video,
    Groups,
    Courses,
    Clients,
    Tariffs,
    Lessons,
    Students,
    Teachers,
    Features,
    Partners,
    Contacts,
    Chapters,
    VideoInfo,
    Advantage,
    Languages,
    Galleries,
    permission,
    Categories,
    SystemUser,
    Permissions,
    BlogCategories,
    StudentCourses,
    FeatureStudents,
    UserRolePermissions
  },
  state: {

  },
  mutations: {

  },
  actions: {

  },
  getters
})
