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
      searchquery: '',
      saveButton: null
    },
    getters: {
      ordersData: state => state.orders,
      ordersPagination: state => state.ordersPagination,
      searchQuery: state => state.searchquery,
      userActivities: state => state.userActivities,
      userActivitiesPagination: state => state.userActivitiesPagination,
      customerOrders: state => state.customerOrders,
      customerOrdersPagination: state => state.customerOrdersPagination,
      saveButton: state => state.saveButton
    },
    mutations: {
      GET_ORDERS: (state, orders) => {
          state.orders = orders
      },
      GET_ORDERS_PAGINATION: (state, ordersPagination) => {
          state.ordersPagination = ordersPagination
      },
      SET_SEARCH_QUERY: (state, query) => {
        state.searchquery = query
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
      },
      GET_SAVE_BUTTON: (state, payload) => {
        state.saveButton = payload
      }
    },
    actions: {
    setSearchQuery ({ commit }, payload) {
      commit('SET_SEARCH_QUERY', payload)
    },
    getOrders ({ commit, state }, payload) {
        const { page } = payload
        // page.showSizeChanger = true
        return new Promise((resolve, reject) => {
        request({
            url: `/order`,
            headers: headers,
            params: {
              page: page.current,
              limit: page.pageSize,
              search: payload.search
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
        page.showQuickJumper = true
        return new Promise((resolve, reject) => {
          console.log(page)
        request({
            url: `/user-activities`,
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
          console.log('Activities: ', result)
          console.log('pagination')
          commit('GET_USER_ACTIVITIES_PAGINATION', pagination)
          commit('GET_USER_ACTIVITIES', result.user_activities)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
      })
    },
    getCustomerOrders ({ commit }, payload) {
        return new Promise((resolve, reject) => {
          // eslint-disable-next-line no-unused-vars
         const { pase, limit, total } = payload
          const page = { pase, limit, total }
          delete payload.total
        request({
            url: `/user-activities`,
            headers: headers,
            params: payload
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
    },
      getCustomerOrdersitem ({ commit }, payload) {
        return new Promise((resolve, reject) => {
          // eslint-disable-next-line no-unused-vars
          const { pase, limit, total } = payload
          const page = { pase, limit, total }
          delete payload.total
          request({
            url: `/user-activities`,
            headers: headers,
            params: payload
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
      },
      saveButton ({ commit }, paylod) {
      commit('GET_SAVE_BUTTON', paylod)
      }
  }
}
  export default orders
