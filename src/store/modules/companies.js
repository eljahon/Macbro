import request from '@/utils/request'

const headers = {
  'Content-Type': 'application/json'
}

const companies = {
  state: {
    companies: [],
    companiesPagination: {},
    companyBranches: [],
    companyBranchesPagination: {},
    companyCorporates: [],
    companyCorporatesPagination: {},
    companyWarehouse: [],
    companyWarehousePagination: {},
    inventoryItems: [],
    inventoryItemsPagination: {},
    searchQuery: '',
    lastTab: 1
  },
  getters: {
    companiesList: state => state.companies,
    companiesPagination: state => state.companiesPagination,
    companyBranchesList: state => state.companyBranches,
    companyBranchesPagination: state => state.companyBranchesPagination,
    companyCorporatesList: state => state.companyCorporates,
    companyCorporatesPagination: state => state.companyCorporatesPagination,
    companyWarehouseList: state => state.companyWarehouse,
    companyWarehousePagination: state => state.companyWarehousePagination,
    inventoryItemsList: state => state.inventoryItems,
    inventoryItemsPagination: state => state.inventoryItemsPagination,

    searchQuery: state => state.searchQuery,
    lastTab: state => state.lastTab
  },
  mutations: {
    SET_COMPANIES: (state, companies) => {
      state.companies = companies
    },
    SET_COMPANIES_PAGINATION: (state, companiesPagination) => {
      state.companiesPagination = companiesPagination
    },
    SET_COMPANY_BRANCHES: (state, companyBranches) => {
      state.companyBranches = companyBranches
    },
    SET_COMPANY_BRANCHES_PAGINATION: (state, companyBranchesPagination) => {
      state.companyBranchesPagination = companyBranchesPagination
    },
    SET_COMPANY_CORPORATES: (state, companyCorporates) => {
      state.companyCorporates = companyCorporates
    },
    SET_COMPANY_CORPORATES_PAGINATION: (state, companyCorporatesPagination) => {
      state.companyCorporatesPagination = companyCorporatesPagination
    },
    SET_COMPANY_WAREHOUSE: (state, companyWarehouse) => {
      state.companyWarehouse = companyWarehouse
    },
    SET_COMPANY_WAREHOUSE_PAGINATION: (state, companyWarehousePagination) => {
      state.companyWarehousePagination = companyWarehousePagination
    },
    SET_INVENTORY_ITEMS: (state, inventoryItems) => {
      state.inventoryItems = inventoryItems
    },
    SET_INVENTORY_ITEMS_PAGINATION: (state, inventoryItemsPagination) => {
      state.inventoryItemsPagination = inventoryItemsPagination
    },

    SET_SEARCH_QUERY: (state, query) => {
      state.searchQuery = query
    },
    SET_LAST_TAB: (state, lastTab) => {
      state.lastTab = lastTab
    }
  },
  actions: {
    setLastTab ({ commit }, tab) {
      commit('SET_LAST_TAB', tab)
    },
    setSearchQuery ({ commit }, searchQuery) {
      commit('SET_SEARCH_QUERY', searchQuery)
    },
    getCompanies ({ commit, state }, page) {
      const { searchQuery } = state
      if (!page) {
        page = { current: 1, pageSize: 10, total: null }
      }
      return new Promise((resolve, reject) => {
        request({
          url: '/company',
          headers: headers,
          params: { page: page.current, limit: page.pageSize, name: searchQuery }
        })
          .then(result => {
            const pagination = { ...page }
            pagination.total = parseInt(result.count)
            commit('SET_COMPANIES_PAGINATION', pagination)
            commit('SET_COMPANIES', result.companies)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    getCompanyBranches ({ commit, state }, page) {
      const { searchQuery } = state
      if (!page) {
        page = { current: 1, pageSize: 10, total: null }
      }
      return new Promise((resolve, reject) => {
        request({
          url: '/branch',
          headers: headers,
          params: { page: page.current, limit: page.pageSize, name: searchQuery, company_id: page.company_id }
        })
          .then(result => {
            const pagination = { ...page }
            pagination.total = parseInt(result.count)
            commit('SET_COMPANY_BRANCHES_PAGINATION', pagination)
            commit('SET_COMPANY_BRANCHES', result.branches)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    getCompanyCorporates ({ commit, state }, page) {
      const { searchQuery } = state
      if (!page) {
        page = { current: 1, pageSize: 10, total: null }
      }
      return new Promise((resolve, reject) => {
        request({
          url: '/corporate',
          headers: headers,
          params: { page: page.current, limit: page.pageSize, search: searchQuery, company_id: page.company_id }
        })
          .then(result => {
            const pagination = { ...page }
            pagination.total = parseInt(result.count)
            commit('SET_COMPANY_CORPORATES_PAGINATION', pagination)
            commit('SET_COMPANY_CORPORATES', result.corporates)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    getCompanyWarehouse ({ commit, state }, page) {
      const { searchQuery } = state
      if (!page) {
        page = { current: 1, pageSize: 10, total: null }
      }
      return new Promise((resolve, reject) => {
        request({
          url: '/warehouse',
          headers: headers,
          params: { page: page.current, limit: page.pageSize, name: searchQuery, company_id: page.company_id }
        })
          .then(result => {
            const pagination = { ...page }
            pagination.total = parseInt(result.count)
            commit('SET_COMPANY_WAREHOUSE_PAGINATION', pagination)
            commit('SET_COMPANY_WAREHOUSE', result.warehouses)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    getInventoryItems ({ commit, state }, page) {
      const { searchQuery } = state
      if (!page) {
        page = { current: 1, pageSize: 10, total: null }
      }

      return new Promise((resolve, reject) => {
        request({
          url: '/inventory-item',
          headers: headers,
          params: { page: page.current, limit: page.pageSize, name: searchQuery, warehouse_id: page.warehouse_id }
        })
          .then(result => {
            console.log(result.warehouses)
            const pagination = { ...page }
            pagination.total = parseInt(result.count)
            commit('SET_INVENTORY_ITEMS_PAGINATION', pagination)
            commit('SET_INVENTORY_ITEMS', result.inventory_items)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  }
}
export default companies
