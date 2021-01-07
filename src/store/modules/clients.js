import request from '@/utils/request'

const headers = {
  'Content-Type': 'application/json'
}

const clients = {
    state: {
      clients: [],
      pagination: {},
      selectedClient: {}
    },
    getters: {
      paginationClient: state => state.pagination,
      clients: state => state.clients,
      selectedClient: state => state.selectedClient
    },
    mutations: {
      GET_CLIENTS: (state, clients) => {
          state.clients = clients
      },
      GET_CLIENTS_PAGINATION: (state, pagination) => {
        state.pagination = pagination
      },
      GET_SELECTED_CLIENT: (state, selectedClient) => {
        state.selectedClient = selectedClient
      }
    },
    actions: {
      getClients ({ commit }, page) {
        if (!page) {
          page = { current: 1, pageSize: 10, total: null }
        }
        return new Promise((resolve, reject) => {
        request({
            url: '/customers',
            headers: headers,
            params: { page: page.current, limit: page.pageSize }
        })
          .then(result => {
          const pagination = { ...page }
          pagination.total = parseInt(result.count)
          commit('GET_CLIENTS_PAGINATION', pagination)
          commit('GET_CLIENTS', result.clients)
          console.log('pagination total' + result.count)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
      })
    },
    getSelectedClient ({ commit }, id) {
      return new Promise((resolve, reject) => {
          console.log(id)
          request({
              url: '/users/' + id,
              method: 'get'
          })
          .then(result => {
          commit('GET_SELECTED_CLIENT', result)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
      })
    }
  }
}
  export default clients
