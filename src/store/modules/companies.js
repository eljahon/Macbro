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
    searchQuery: ''
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
    searchQuery: state => state.searchQuery
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
    SET_SEARCH_QUERY: (state, query) => {
      state.searchQuery = query
    }
  },
  actions: {
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
          params: { page: page.current, limit: page.pageSize, search: searchQuery }
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
          params: { page: page.current, limit: page.pageSize, search: searchQuery, company_id: page.company_id }
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
          params: { page: page.current, limit: page.pageSize, search: searchQuery }
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
          params: { page: page.current, limit: page.pageSize, search: searchQuery, company_id: page.company_id }
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
    }
  }
}
  export default companies
