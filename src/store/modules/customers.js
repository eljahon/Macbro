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
      userList: [],
      contractorsList: [],
      userPagination: {},
      contractorsPagination: {},
      postavshikPagination: {},
      postavshikList: []
    },
    getters: {
      postavshikPagination: state => state.postavshikPagination,
      postavshikList: state => state.postavshikList,
      contractorsList: state => state.contractorsList,
      contractorsPagination: state => state.contractorsPagination,
      userPagination: state => state.userPagination,
      userList: state => state.userList,
      customersData: state => state.customers,
      customersPagination: state => state.customersPagination,
      searchQuery: state => state.searchquery
    },
    mutations: {
      GET_CUSTOMERS: (state, customers) => {
          state.customers = customers
      },
      GET_POSTAVSHIK_LIST: (state, postavshik) => {
        state.postavshikList = postavshik
      },
      GET_POSTAVSHIK_PAGINATION: (state, payload) => {
        state.postavshikPagination = payload
      },
      GET_CONTRACTORS_PAGINATION: (state, customersPagination) => {
          state.contractorsPagination = customersPagination
      },
      GET_CONTRACTORS_LIST: (state, contractors) => {
        state.contractorsList = contractors
      },
      GET_USERS_PAGINATON: (state, userpagination) => {
        state.userPagination = userpagination
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
    //   getCustomers ({ commit, state }, payload) {
    //     let { page } = payload
    //     const { searchquery } = state
    //     if (!page) {
    //       page = { current: 1, pageSize: 10, total: null }
    //     }
    //     page.showQuickJumper = true
    //     return new Promise((resolve, reject) => {
    //       console.log(page)
    //     request({
    //         url: `/user`,
    //         headers: headers,
    //         params: {
    //           page: page.current,
    //           limit: page.pageSize,
    //           search: searchquery,
    //           offset: 0,
    //           user_type: 'client'
    //         }
    //     })
    //       .then(result => {
    //       const pagination = { ...page }
    //       pagination.total = parseInt(result.count)
    //       console.log(pagination)
    //       console.log('pagination')
    //       commit('GET_CUSTOMERS_PAGINATION', pagination)
    //       commit('GET_CUSTOMERS', result.clients)
    //         console.log('clients', result.clients)
    //       resolve()
    //     })
    //     .catch(error => {
    //       reject(error)
    //     })
    //   })
    // },
      getUserListAll ({ commit }, payload) {
        const { page } = payload
        console.log('page====>..', page)
        // eslint-disable-next-line no-undef,no-unused-vars
        // const { searchquery } = state
        return new Promise((resolve, reject) => {
          request({
            url: `/user`,
            method: 'get',
            headers: headers,
            params: {
              page: page.current,
              limit: page.pageSize,
              offset: payload.offset,
              user_type: payload.user_type,
              search: payload.search
            }
          }).then(result => {
            // eslint-disable-next-line no-undef
            const pagination = { ...page }
            pagination.total = parseInt(result.count)
            console.log(result)
            commit('SET_USER_LIST', result.users)
            commit('GET_USERS_PAGINATON', pagination)
            // eslint-disable-next-line no-undef
            resolve(result)
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
      },
      getContractorsAllList ({ commit }, payolad) {
        const { page } = payolad
          return new Promise((resolve, reject) => {
            request({
              url: `/user`,
              method: 'GET',
              params: {
                      search: payolad.search,
                     user_type: payolad.user_type,
                     page: payolad.page.page,
                     limit: payolad.page.pageSiz
              }
            }).then(result => {
              console.log(result)
              resolve(result.users)
              const pagination = { ...page }
              pagination.total = parseInt(result.count)
              commit('GET_CONTRACTORS_PAGINATION', pagination)
              commit('GET_CONTRACTORS_LIST', result.users)
            }).catch(rej => {
              reject(rej)
            })
          })
          // request({
          //   url: '/user',
          //   method: 'Get',
          //   params: {
          //     search: payolad.search,
          //     user_type: payolad.user_type,
          //     page: payolad.page.page,
          //     limit: payolad.page.pageSiz
          //   }
          // })
          //   .then(res => {
          //     console.log('salom username ====> ')
          //     resovle(res)
          //   })
          //   .catch(err => {
          //     reject(err)
          //   })
      },
      getPostavshiksAllList ({ commit }, payolad) {
          return new Promise((resolve, reject) => {
            request({
              url: `/user`,
              method: 'GET',
              params: {
                      search: payolad.search,
                     user_type: payolad.user_type,
                     page: payolad.page.page,
                     limit: payolad.page.pageSiz
              }
            }).then(result => {
              console.log(result)
              resolve(result.users)
              const pagination = payolad.page
              pagination.page.total = result.count
              commit('GET_POSTAVSHIK_PAGINATION', pagination)
              commit('GET_POSTAVSHIK_LIST', result.users)
            }).catch(rej => {
              reject(rej)
            })
          })
          // request({
          //   url: '/user',
          //   method: 'Get',
          //   params: {
          //     search: payolad.search,
          //     user_type: payolad.user_type,
          //     page: payolad.page.page,
          //     limit: payolad.page.pageSiz
          //   }
          // })
          //   .then(res => {
          //     console.log('salom username ====> ')
          //     resovle(res)
          //   })
          //   .catch(err => {
          //     reject(err)
          //   })
      }

    }
}
  export default customers
