import request from '@/utils/request'

const headers = {
  'Content-Type': 'application/json'
}

const inventory = {
    state: {
      inventory: [],
      inventoryPagination: {}
    },
    getters: {
      inventoryData: state => state.inventory,
      inventoryPagination: state => state.inventoryPagination
    },
    mutations: {
      GET_INVENTORY: (state, inventory) => {
          state.inventory = inventory
      },
      GET_INVENTORY_PAGINATION: (state, inventoryPagination) => {
          state.inventoryPagination = inventoryPagination
      }
    },
    actions: {
      getInventory ({ commit, state }, payload = { page: null }) {
        let { page } = payload
        const { searchQuery } = state
        if (!page) {
          page = { current: 1, pageSize: 10, total: null }
        }
        return new Promise((resolve, reject) => {
          console.log(page)
        request({
            url: `/inventory-item`,
            headers: headers,
            params: {
              page: page.current,
              search: searchQuery
            }
        })
          .then(result => {
          const pagination = { ...page }
          pagination.total = parseInt(result.count)
          commit('GET_INVENTORY_PAGINATION', pagination)
          commit('GET_INVENTORY', result.inventory_items)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
      })
    }
  }
}
  export default inventory
