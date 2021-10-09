// with polyfills
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import i18n from './locales'
import { VueAxios } from './utils/request'
import ProLayout, { PageHeaderWrapper } from '@ant-design-vue/pro-layout'
import themePluginConfig from '../config/themePluginConfig'
import { FormModel, Rate } from 'ant-design-vue'
import * as VueGoogleMaps from 'vue2-google-maps'
import FlagIcon from 'vue-flag-icon'
import YmapPlugin from 'vue-yandex-maps'
import vueDebounce from 'vue-debounce'
import tinymce from '@tinymce/tinymce-vue'
import statusTag from './components/statusTag.vue'
import editBtn from './components/editBtn.vue'
import deleteBtn from './components/deleteBtn.vue'
import previewBtn from './components/previewBtn.vue'
import mainBreadcrumb from './components/mainBreadcrumb.vue'
import UnderlineTabs from './components/CustomTabs/TabsUnderline.vue'
import UnderlineTabsItem from './components/CustomTabs/TabsUnderlineItem.vue'
import numberToPrice from './utils/numberToPrice'
import numberToDollar from './utils/numberToDollar'

import myIcons from './core/icons'
import VSwatches from 'vue-swatches'
import 'vue-swatches/dist/vue-swatches.css'
import bootstrap from './core/bootstrap'
import './core/lazy_use'
import './permission' // permission control
import './utils/filter' // global filter
import './assets/global.less'
import '@/assets/global.less'
import '@/global.css'
Vue.config.productionTip = false
// mount axios to `Vue.$http` and `this.$http`
const settings = {
  apiKey: '13b2041b-80b3-47fb-b10e-217ad5a09315',
  lang: 'ru_RU',
  coordorder: 'latlong',
  version: '2.1'
}

Vue.prototype.$myIcons = myIcons
Vue.prototype.$numberToPrice = numberToPrice
Vue.prototype.$numberToDollar = numberToDollar
Vue.use(YmapPlugin, settings)
Vue.use(FlagIcon)
Vue.use(vueDebounce, {
  defaultTime: '700ms'
})
Vue.use(tinymce)
Vue.use(VueAxios)
Vue.use(FormModel)
Vue.use(Rate)

Vue.component('underline-tabs', UnderlineTabs)
Vue.component('underline-tabs-item', UnderlineTabsItem)
Vue.component('breadcrumb-row', mainBreadcrumb)
Vue.component('v-swatches', VSwatches)
Vue.component('preview-btn', previewBtn)
Vue.component('delete-btn', deleteBtn)
Vue.component('edit-btn', editBtn)
Vue.component('status-tag', statusTag)

Vue.component('pro-layout', ProLayout)
Vue.component('page-header-wrapper', PageHeaderWrapper)
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyDC6tKEbtRlB6B0HgrFEN9P6ztTSJ89xt8',
    libraries: 'places'
  }
})
Vue.prototype.$moneyFormat = (str) => {
  if (!str) return ''
  return str.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$& ')
}
window.umi_plugin_ant_themeVar = themePluginConfig.theme

new Vue({
  router,
  store,
  i18n,
  created: bootstrap,
  render: h => h(App)
}).$mount('#app')
