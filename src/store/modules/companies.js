import request from '@/utils/request'

const headers = {
  'Content-Type': 'application/json'
}

const shops = {
    state: {
      shops: [],
      shopsPagination: {},
      searchQuery: '',
      shopProducts: [],
      shopProductPagination: {},
      allProducts: []
    },
    getters: {
      shopsData: state => state.shops,
      shopsPagination: state => state.shopsPagination,
      searchQuery: state => state.searchQuery,
      shopProducts: state => state.shopProducts,
      shopProductPagination: state => state.shopProductPagination,
      allProducts: state => state.allProducts
    },
    mutations: {
      GET_SHOPS: (state, shops) => {
          state.shops = shops
      },
      GET_SHOPS_PAGINATION: (state, shopsPagination) => {
          state.shopsPagination = shopsPagination
      },
      SET_SEARCH_QUERY: (state, query) => {
        state.searchQuery = query
      },
      GET_SHOP_PRODUCT: (state, payload) => {
        state.shopProducts = payload
      },
      GET_SHOP_PRODUCT_PAGINATION: (state, payload) => {
        state.shopProductPagination = payload
      },
      GET_ALL_PRODUCTS: (state, payload) => {
        state.allProducts = payload
      }
    },
    actions: {
      setSearchQuery ({ commit }, searchQuery) {
        commit('SET_SEARCH_QUERY', searchQuery)
      },
      getProductsByShop ({ commit }, payload = { page: null }) {
        let { page } = payload
        var id = payload.id
        var search = payload.search ? payload.search : undefined
        if (!page) {
          page = { current: 1, pageSize: 10, total: null }
        }
        return new Promise((resolve, reject) => {
          request({
            url: `/shop/${id}/products`,
            method: 'GET',
            params: {
              page: page.current,
              search: search
            }
          }).then(res => {
            console.log(res)
            resolve()
            const pagination = { ...page }
            pagination.total = parseInt(res.count)
            commit('GET_SHOP_PRODUCT_PAGINATION', pagination)
            commit('GET_SHOP_PRODUCT', res.products)
          })
        })
      },
      getAllProducts ({ commit }, payload) {
        return new Promise((resolve, reject) => {
          request({
            url: `/product`,
            method: 'GET',
            params: {
              limit: 10,
              search: payload !== undefined ? payload : undefined
            }
          }).then(res => {
            resolve()
            console.log(res)
            commit('GET_ALL_PRODUCTS', res.products)
          })
        })
      },
      updateQuantity ({ commit }, payload) {
        return new Promise((resolve, reject) => {
          console.log(payload.id)
          request({
            url: `/shop/${payload.id}/update-quantity`,
            method: 'put',
            data: payload.files
          }).then(res => {
            resolve()
            console.log(res)
          })
        })
      },
      getShops ({ commit, state }, payload = { page: null }) {
        let { page } = payload
        const { searchQuery } = state
        if (!page) {
          page = { current: 1, pageSize: 10, total: null }
        }
        return new Promise((resolve, reject) => {
          console.log(page)
        request({
            url: `/shop`,
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
          commit('GET_SHOPS_PAGINATION', pagination)
          commit('GET_SHOPS', result.shops)
          console.log(result.count)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
      })
    }
  }
}
  export default shops
