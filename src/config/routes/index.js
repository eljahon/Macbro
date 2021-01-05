import Blogs from './Blogs'
import Users from './Users'
import Roles from './Roles'
import Courses from './Courses'
import Profile from './Profile'
import Dashboard from './Dashboard'
import Notification from './Notifications'
import ContentSettings from './ContentSettings'

const children = [
  Dashboard,
  Courses,
  Notification,
  Blogs,
  ContentSettings,
  Users,
  Roles,
  Profile
]

export default children.map(el => ({ ...el,
component: {
    name: 'RouteView',
    render: (h) => h('router-view')
  }
}))
