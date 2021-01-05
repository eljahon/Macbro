import antdEnUS from 'ant-design-vue/es/locale-provider/en_US'
import momentEU from 'moment/locale/ru'
// import defaults
import { tableRu } from './Defaults/table'
import { loginRu } from './Defaults/login'
import { buttonRu } from './Defaults/buttons'
import { drawerRu } from './Defaults/drawer'

// import blogs
import { blogRu } from './Blogs'
import { cmsRu } from './CMS'
import { courseRu } from './Course'

const components = {
  antLocale: antdEnUS,
  momentName: 'eu',
  momentLocale: momentEU
}

const locale = {
  ...tableRu,
  ...loginRu,
  ...buttonRu,
  ...drawerRu,
  ...blogRu,
  ...cmsRu,
  ...courseRu
}

export default {
  ...components,
  ...locale
}
