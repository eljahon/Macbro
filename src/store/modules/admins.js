import request from '@/utils/request'
import { ACCESS_TOKEN } from '../mutation-types'
import storage from 'store'

const admins = {
    state: {
      admins: [],
      admin: null,
      pagination: {},
      searchquery: ''
    },
    getters: {
      admin: state => state.admin,
      adminsPagination: state => state.pagination,
      admins: state => state.admins,
      searchQuery: state => state.searchquery
    },
    mutations: {
      GET_ADMIN: (state, admin) => {
        state.admin = admin
      },
      GET_ADMINS: (state, admins) => {
          state.admins = admins
      },
      GET_ADMINS_PAGINATION: (state, pagination) => {
        state.pagination = pagination
      },
      SET_SEARCH_QUERY: (state, query) => {
        state.searchquery = query
      }
    },
    actions: {
      setSearchQuery ({ commit }, payload) {
        commit('SET_SEARCH_QUERY', payload)
      },
      getAdmin ({ commit }, payload) {
        return new Promise((resolve, reject) => {
          request({
              url: '/admin/profile',
              headers: {
                'Authorization': storage.get(ACCESS_TOKEN),
                'Content-Type': 'application/json'
              }
          })
          .then(result => {
              commit('GET_ADMIN', result)
              resolve()
          })
          .catch(error => {
              reject(error)
          })
        })
      },
      getAdmins ({ commit, state }, payload = { page: null, search: true }) {
        let { page } = payload
        // if search === false all banner s will be requested
        const { search } = payload
        const { searchQuery } = state
        if (!page) {
          page = { current: 1, pageSize: 10, total: null }
        }
        return new Promise((resolve, reject) => {
          request({
              url: '/admin',
              params: {
                page: page.current,
                limit: page.pageSize,
                search: search ? searchQuery : ''
              }
          })
          .then(result => {
              const pagination = { ...page }
              pagination.total = parseInt(result.count)
              commit('GET_ADMINS_PAGINATION', pagination)
              commit('GET_ADMINS', result.admins)
              resolve()
          })
          .catch(error => {
              reject(error)
          })
        })
    }
  }
}
  export default admins
