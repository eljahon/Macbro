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
    lastTab: 1,
    array: [
      {
        ru: 'админ',
        en: 'admin',
        client_type_id: '5a3818a9-90f0-44e9-a053-3be0ba1e2c01',
        role_id: 'a1ca1301-4da9-424d-a9e2-578ae6dcde01'
      },
      {
        ru: 'директор',
        en: 'director',
        client_type_id: '5a3818a9-90f0-44e9-a053-3be0ba1e2c02',
        role_id: 'a1ca1301-4da9-424d-a9e2-578ae6dcde02'
      },
      {
        ru: 'менеджер',
        en: 'manager',
        client_type_id: '5a3818a9-90f0-44e9-a053-3be0ba1e2c03',
        role_id: 'a1ca1301-4da9-424d-a9e2-578ae6dcde03'
      },
      {
        ru: 'консультант',
        en: 'consultant',
        client_type_id: '5a3818a9-90f0-44e9-a053-3be0ba1e2c04',
        role_id: 'a1ca1301-4da9-424d-a9e2-578ae6dcde04'
      },
      {
        ru: 'кассир',
        en: 'cashier',
        client_type_id: '5a3818a9-90f0-44e9-a053-3be0ba1e2c05',
        role_id: 'a1ca1301-4da9-424d-a9e2-578ae6dcde05'
      },
      {
        ru: 'курьер',
        en: 'courier',
        client_type_id: '5a3818a9-90f0-44e9-a053-3be0ba1e2c06',
        role_id: 'a1ca1301-4da9-424d-a9e2-578ae6dcde06'
      },
      { ru: 'контрагент',
        en: 'counteragent',
        client_type_id: '5a3818a9-90f0-44e9-a053-3be0ba1e2c11',
       role_id: 'a1ca1301-4da9-424d-a9e2-578ae6dcde11' }
    ],
    branchesList: [],
    branchesIdList: [],
    usertype: null,
    staffselectsadd: null
  },
  getters: {
    branchesIdList: state => state.branchesIdList,
    branchesList: state => state.branchesList,
    UserTypeSelect: state => state.array,
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
    lastTab: state => state.lastTab,
    staffSelectsAdd: state => state.staffselectsadd
  },
  mutations: {
    STAFF_ADD_SELECT (state, paylod) {
      state.staffselectsadd = paylod
    },
    SET_USER_TYPEAUTH (state, payload) {
      state.usertype = payload
    },
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
    },
    GET_BRANCECH_LIST: (state, payload) => {
      state.branchesList = payload
    },
    GET_BRANCHES_ID_LIST: (state, payload) => {
      state.branchesIdList = payload
    }
  },
  actions: {
    setLastTab ({ commit }, tab) {
      commit('SET_LAST_TAB', tab)
    },
    setSearchQuery ({ commit }, searchQuery) {
      commit('SET_SEARCH_QUERY', searchQuery)
    },
    // getCompaniesListAll ({ commit, state }, page) {
    //   const { searchQuery } = state
    //   console.log(page)
    //   if (!page) {
    //     page = { current: 1, pageSize: 10, total: null }
    //   }
    //   console.log('salom')
    //   return new Promise((resolve, reject) => {
    //     request({
    //       url: '/company',
    //       headers: headers,
    //       method: 'get',
    //       params: { page: page.current, limit: page.pageSize, name: searchQuery }
    //     })
    //       .then(result => {
    //         const pagination = { ...page }
    //         pagination.total = parseInt(result.count)
    //         // commit('SET_COMPANIES_PAGINATION', pagination)
    //         // commit('SET_COMPANIES', result.companies)
    //         console.log(result)
    //         resolve()
    //       })
    //       .catch(error => {
    //         reject(error)
    //       })
    //   })
    // },
    getCompanies ({ commit, state }, page) {
      const { searchQuery } = state
      if (!page) {
        page = { current: 1, pageSize: 10, total: null }
      }
      return new Promise((resolve, reject) => {
        request({
          url: '/company',
          headers: headers,
          method: 'get',
          params: { page: page.current, limit: page.pageSize, name: searchQuery, search: page.search }
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
    getUsers ({ commit, state }, page) {
      if (!page) {
        page = { current: 1, pageSize: 10, total: null }
      }
      return new Promise((resolve, reject) => {
        request({
          url: '/user',
          headers: headers,
          method: 'get',
          params: {
            page: page.page.current,
            limit: page.page.pageSize,
            company_id: page.company_id,
            offset: page.offset,
            user: page.user,
            user_type: page.user_type,
            search: page.search
          }
        })
          .then(result => {
            const pagination = { ...page }
            pagination.total = parseInt(result.count)
            // commit('SET_COMPANIES_PAGINATION', pagination)
            // commit('SET_COMPANIES', result.companies)
            commit('GET_BRANCECH_LIST', result.users)
            resolve(result)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    getCompanyUserItem ({ commit, state }, page) {
      console.log(page)
      return new Promise((resolve, reject) => {
        request({
          url: `/user/${page}`,
          headers: headers,
          method: 'get'
        })
          .then(result => {
            resolve(result)
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
    },
    companyUserTypeCreate ({ commit, dispatch, state }, payload) {
      return new Promise((resolve, reject) => {
        const { usertype } = state
        const headers = {
          'Content-Type': 'application/json'
        }
        request({
          url: 'https://api.auth.macbro.uz/v1/auth/user/register',
          method: 'post',
          data: {
            client_type_id: usertype.client_type_id,
            password: '',
            login: '',
            phone: payload.phone_number,
            role_id: usertype.role_id
          },
          headers: headers
        })
          .then(res => {
            resolve(res)
            payload.id = res.data
            dispatch('ApiUserCreateType', payload)
            // this.requesting = false
            // eslint-disable-next-line standard/object-curly-even-spacing
            // this.$router.push({ name: 'CompaniesEdit', params: { id: this.$route.query.companyId } })
          })
          .catch(err => {
            // this.requesting = false
            reject(err)
          })
          .finally(() => {
          })
      })
    },
    ApiUserCreateType ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        request({
          url: '/user',
          method: 'post',
          data: payload,
          headers: headers
        }).then(res => {
          console.log(res)
          resolve(res)
        })
          .catch(err => {
            reject(err)
            console.log(err)
          })
      })
    },
    userType ({ commit }, payload) {
      commit('SET_USER_TYPEAUTH', payload)
    },
    staffAddSelects ({ commit, state }, staffid) {
      // eslint-disable-next-line no-undef
      const { branchesList } = state

      // eslint-disable-next-line no-unused-expressions
      const staffAddBranch = branchesList.filter(e => staffid.includes(e.id))
      commit('STAFF_ADD_SELECT', staffAddBranch)
    },
    getSelectBranchAll ({ commit, dispatch }, payload) {
      // eslint-disable-next-line no-unused-vars
      // const { id, staff } = payload
      return new Promise((resolve, reject) => {
        request({
          url: `/branch/${payload}`,
          method: 'get',
          headers: headers
        })
          .then(res => {
            resolve(res)
            commit('GET_BRANCHES_ID_LIST', res.staff)
            dispatch('staffAddSelects', res.staff)
          })
          .catch(err => {
            reject(err)
          })
          .finally(() => {
          })
      })
    }
  }
}
export default companies
