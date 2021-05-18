import request from '@/utils/request'

const headers = {
  'Content-Type': 'application/json'
}

const customers = {
    state: {
      pageSiz: null,
      customers: [],
      customersPagination: {},
      searchquery: '',
      userList: []
    },
    getters: {
      user_List: state => state.userList,
      customersData: state => state.customers,
      customersPagination: state => state.customersPagination,
      searchQuery: state => state.searchquery
    },
    mutations: {
      GET_CUSTOMERS: (state, customers) => {
          state.customers = customers
      },
      GET_CUSTOMERS_PAGINATION: (state, customersPagination) => {
          state.customersPagination = customersPagination
      },
      SET_SEARCH_QUERY: (state, query) => {
        state.searchquery = query
      },
      SET_USER_LIST: (state, payload) => {
        state.userList = payload
}
    },
    actions: {
      setSearchQuery ({ commit }, searchQuery) {
        commit('SET_SEARCH_QUERY', searchQuery)
      },
      getCustomers ({ commit, state }, payload = { page: null }) {
        let { page } = payload
        const { searchquery } = state
        if (!page) {
          page = { current: 1, pageSize: 10, total: null }
        }
        page.showQuickJumper = true
        return new Promise((resolve, reject) => {
          console.log(page)
        request({
            url: `/client`,
            headers: headers,
            params: {
              page: page.current,
              phone_number: searchquery
            }
        })
          .then(result => {
          const pagination = { ...page }
          pagination.total = parseInt(result.count)
          console.log(pagination)
          console.log('pagination')
          commit('GET_CUSTOMERS_PAGINATION', pagination)
          commit('GET_CUSTOMERS', result.clients)
            console.log('clients', result.clients)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
      })
    },
      getUserList ({ commit }, payload) {
        return new Promise((resolve, reject) => {
          request({
            url: `/user`,
            method: 'get',
            params: {
              page: 10,
              // eslint-disable-next-line no-undef
              user_type: 'client'
            }
          }).then(result => {
            // eslint-disable-next-line no-undef
            console.log(result)
            commit('SET_USER_LIST', result.users)
            // eslint-disable-next-line no-undef
            resolve()
          }).catch(rej => {
            reject(rej)
          })
        })
      },
      getUserListItem ({ commit }, id) {
        return new Promise((resolve, reject) => {
          request({
            url: `/user/${id}`,
            method: 'get'
          }).then(result => {
            console.log(result)
            resolve(result)
          }).catch(rej => {
            reject(rej)
          })
        })
      },
      getUserListItemRemove ({ commit }, id) {
        console.log(id)
        return new Promise((resolve, reject) => {
          request({
            url: `/user/${id}`,
            method: 'delete'
          }).then(result => {
            console.log(result)
            resolve(result)
          }).catch(rej => {
            reject(rej)
          })
        })
      }

    }
}
  export default customers
