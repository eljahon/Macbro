import request from '@/utils/request'

const headers = {
  'Content-Type': 'application/json'
}

const orders = {
    state: {
      orders: [],
      ordersPagination: {},
      userActivities: [],
      userActivitiesPagination: {},
      customerOrders: [],
      customerOrdersPagination: {},
      searchQuery: ''
    },
    getters: {
      ordersData: state => state.orders,
      ordersPagination: state => state.ordersPagination,
      searchQuery: state => state.searchQuery,
      userActivities: state => state.userActivities,
      userActivitiesPagination: state => state.userActivitiesPagination,
      customerOrders: state => state.customerOrders,
      customerOrdersPagination: state => state.customerOrdersPagination
    },
    mutations: {
      GET_ORDERS: (state, orders) => {
          state.orders = orders
      },
      GET_ORDERS_PAGINATION: (state, ordersPagination) => {
          state.ordersPagination = ordersPagination
      },
      SET_SEARCH_QUERY: (state, query) => {
        state.searchQuery = query
      },
      GET_USER_ACTIVITIES: (state, userActivities) => {
        state.userActivities = userActivities
      },
      GET_USER_ACTIVITIES_PAGINATION: (state, userActivitiesPagination) => {
        state.userActivitiesPagination = userActivitiesPagination
      },
      GET_CUSTOMER_ORDERS: (state, customerOrders) => {
        state.customerOrders = customerOrders
      },
      GET_CUSTOMER_ORDERS_PAGINATION: (state, customerOrdersPagination) => {
        state.customerOrdersPagination = customerOrdersPagination
      }
    },
    actions: {
      setSearchQuery ({ commit }, searchQuery) {
        commit('SET_SEARCH_QUERY', searchQuery)
      },
      getOrders ({ commit, state }, payload = { page: null }) {
        let { page } = payload
        const { searchQuery } = state
        if (!page) {
          page = { current: 1, pageSize: 10, total: null }
        }
        return new Promise((resolve, reject) => {
          console.log(page)
        request({
            url: `/order`,
            headers: headers,
            params: {
              page: page.current,
              search: searchQuery
            }
        })
          .then(result => {
          const pagination = { ...page }
          pagination.total = parseInt(result.count)
          console.log(pagination)
          console.log('pagination')
          commit('GET_ORDERS_PAGINATION', pagination)
          commit('GET_ORDERS', result.orders)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
      })
    },
    getUserActivities ({ commit }, payload = { page: null, orderNumber: '' }) {
        let { page } = payload
        const { orderNumber } = payload
        if (!page) {
          page = { current: 1, pageSize: 10, total: null }
        }
        return new Promise((resolve, reject) => {
          console.log(page)
        request({
            url: `/user-activity`,
            headers: headers,
            params: {
              page: page.current,
              element: 'order',
              element_id: orderNumber
            }
        })
        .then(result => {
          const pagination = { ...page }
          pagination.total = parseInt(result.count)
          console.log(pagination)
          console.log('pagination')
          commit('GET_USER_ACTIVITIES_PAGINATION', pagination)
          commit('GET_USER_ACTIVITIES', result.activities)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
      })
    },
    getCustomerOrders ({ commit }, payload = { page: null, customerId: '' }) {
        let { page } = payload
        const { customerId } = payload
        if (!page) {
          page = { current: 1, pageSize: 10, total: null }
        }
        return new Promise((resolve, reject) => {
          console.log(page)
        request({
            url: `/customer/orders/${customerId}`,
            headers: headers,
            params: {
              page: page.current
            }
        })
        .then(result => {
          console.log('result', result)
          const pagination = { ...page }
          pagination.total = parseInt(result.count)
          console.log(pagination)
          console.log('pagination')
          commit('GET_CUSTOMER_ORDERS_PAGINATION', pagination)
          commit('GET_CUSTOMER_ORDERS', result.orders)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
      })
    }
  }
}
  export default orders
