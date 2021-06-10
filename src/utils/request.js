import axios from 'axios'
import store from '@/store'
import storage from 'store'
import notification from 'ant-design-vue/es/notification'
import { VueAxios } from './axios'
import { ACCESS_TOKEN, REFRESH_TOKEN, USER_ROLE } from '@/store/mutation-types'

const request = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL,
  timeout: 10000
})

const errorHandler = (error) => {
  if (error.response) {
    const data = error.response.data
    // const token = storage.get(ACCESS_TOKEN)
    const rtoken = storage.get(REFRESH_TOKEN)
    if (error.response.status === 403) {
      notification.error({
        message: 'Forbidden',
        description: data.message
      })
    }
    if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
      notification.error({
        message: 'Unauthorized',
        description: 'Authorization verification failed'
      })
      if (rtoken) {
        store.dispatch('Refresh', rtoken).catch(() => {
          store.commit('SET_TOKEN', '')
          store.commit('SET_ROLES', [])
          // console.log('Logout routers', asyncRouterMap)
          storage.remove(USER_ROLE)
          storage.remove(ACCESS_TOKEN)
          storage.remove(REFRESH_TOKEN)
          location.reload(true)
        })
      } else {
        store.commit('SET_TOKEN', '')
        store.commit('SET_ROLES', [])
        // console.log('Logout routers', asyncRouterMap)
        storage.remove(USER_ROLE)
        storage.remove(ACCESS_TOKEN)
        storage.remove(REFRESH_TOKEN)
        location.reload(true)
      }
    }
  }
  return Promise.reject(error)
}

// request interceptor
request.interceptors.request.use(config => {
  const token = storage.get(ACCESS_TOKEN)
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  config.headers['platform-id'] = '7d4a4c38-dd84-4902-b744-0488b80a4c01'
  return config
}, errorHandler)

request.interceptors.response.use((response) => {
  return response.data
}, errorHandler)

const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, request)
  }
}

export default request

export {
  installer as VueAxios,
  request as axios
}
