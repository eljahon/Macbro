import request from '@/utils/request'
// import categories from '@/store/modules/categories'
// const baseUrl = 'https://test.api.staff.macbro.uz/v1'
const baseUrLs = {
  transaction: '/billing/transaction',
  acountList: '/billing/account',
  SubacountList: '/billing/subaccount',
  espenList: '/billing/expenditure',
  subCatigoryList: '/billing/subaccount-category'
}
const reports = {
  state: {
    subCatigoryList: [],
    transactionList: [],
    TrPagination: {},
    EspaneGetAllList: [],
    EspenPagination: {},
    SubAcountList: [],
    SunPagnation: {},
    AcPagination: {},
    AcountList: []
  },
  getters: {
    subCatigoryList: state => state.subCatigoryList,
    EspaneGetAllList: state => state.EspaneGetAllList,
    EspenPagination: state => state.EspenPagination,
    SubAcountList: state => state.SubAcountList,
    SunPagnation: state => state.SunPagnation,
    AcountList: state => state.AcountList,
    AcPagination: state => state.AcPagination,
    transactionList: state => state.transactionList,
    TrPagination: state => state.TrPagination
  },
  mutations: {
    GET_SUB_CATIGORY_LIST: (state, payload) => {
      state.subCatigoryList = payload
    },
    GET_ESPEN_LIST: (state, payload) => {
      state.EspaneGetAllList = payload
    },
    ESPEN_PAGINATION: (state, payload) => {
      state.EspenPagination = payload
    },
    GET_SUB_ACOUNT_LIST: (state, payload) => {
      state.SubAcountList = payload
    },
    GET_SUB_ACOUNT_PAGNATION: (state, payload) => {
      state.SunPagnation = payload
    },
    GET_ACOUNT_LIST: (state, payload) => {
      state.AcountList = payload
    },
    AC_PAGINATION: (state, payload) => {
      state.AcPagination = payload
    },
    GET_TRLIST_ALL: (state, payload) => {
      state.transactionList = payload
    },
    TRPAGNATION: (state, payload) => {
      state.TrPagination = payload
    }
  },
  actions: {
    EspenCreate ({ commit }, paload) {
      return new Promise((resolve, reject) => {
        request({
          url: `${baseUrLs.espenList}`,
          method: 'post',
          data: paload
        })
          .then(res => {
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    SubCatigoryList ({ commit }, payload) {
      // const pagination = payload.page
      return new Promise((resolve, reject) => {
        request({
          url: `${baseUrLs.subCatigoryList}`,
          method: 'get'
        })
          .then(res => {
            console.log(res)
            commit('GET_SUB_CATIGORY_LIST', res.subaccount_categories)
            // pagination.total = parseInt(res.count)
            // commit('ESPEN_PAGINATION', pagination)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    espenDelete ({ commit }, id) {
      return new Promise((resolve, reject) => {
        request({
          url: `${baseUrLs.espenList}/${id}`,
          method: 'delete'
        })
          .then(res => {
            // console.log(res)
            // console.log(res)
            // commit('GET_ESPEN_LIST', res.expenditure_elements)
            // pagination.total = res.count
            // commit('ESPEN_PAGINATION', pagination)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    EsenUpdate ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        request({
          url: `${baseUrLs.espenList}`,
          method: 'put',
          data: payload
        })
          .then(res => {
            // console.log(res)
            // console.log(res)
            // commit('GET_ESPEN_LIST', res.expenditure_elements)
            // pagination.total = res.count
            // commit('ESPEN_PAGINATION', pagination)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    EsenDelete ({ commit }, id) {
      return new Promise((resolve, reject) => {
        request({
          url: `${baseUrLs.espenList}/${id}`,
          method: 'delete'
        })
          .then(res => {
            // console.log(res)
            // console.log(res)
            // commit('GET_ESPEN_LIST', res.expenditure_elements)
            // pagination.total = res.count
            // commit('ESPEN_PAGINATION', pagination)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    SubItemUpdate ({ commit }, id) {
      return new Promise((resolve, reject) => {
        request({
          url: `${baseUrLs.espenList}/${id}`,
          method: 'get'
        })
          .then(res => {
            // console.log(res)
            // commit('GET_ESPEN_LIST', res.expenditure_elements)
            // pagination.total = res.count
            // commit('ESPEN_PAGINATION', pagination)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    GetEspenListAll ({ commit }, payload) {
      const pagination = payload.page
      return new Promise((resolve, reject) => {
        request({
          url: `${baseUrLs.espenList}`,
          method: 'get'
        })
          .then(res => {
            console.log(res)
            console.log(res)
            commit('GET_ESPEN_LIST', res.expenditure_elements)
            pagination.total = res.count
            commit('ESPEN_PAGINATION', pagination)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    GetSubAcountListAll ({ commit }, payload) {
      const pagination = payload.page
      return new Promise((resolve, reject) => {
        request({
          url: `${baseUrLs.SubacountList}`,
          method: 'get',
          params: {
            account_number: payload.account_number,
            category_id: payload.category_id,
            page: pagination.current,
            limit: pagination.pageSize,
            search: payload.search,
            sub_account_category_id: payload.sub_account_category_id

          }
        })
          .then(res => {
            console.log(res)
            commit('GET_SUB_ACOUNT_LIST', res.sub_accounts)
            pagination.total = res.count
            commit('GET_SUB_ACOUNT_PAGNATION', pagination)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    GetAcountAllList ({ commit }, payload) {
      const pagination = payload.page
      return new Promise((resolve, reject) => {
        request({
          url: `${baseUrLs.acountList}`,
          method: 'get',
          params: {
            page: pagination.current,
            limit: pagination.pageSize,
            search: payload.search,
            account_group_id: payload.account_group_id,
            account_number: payload.account_number

          }
        })
          .then(res => {
            commit('GET_ACOUNT_LIST', res.accounts)
            pagination.total = res.count
            commit('AC_PAGINATION', pagination)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    GetTrListAll ({ commit }, payload) {
      const pagnation = payload.page
      return new Promise((resolve, reject) => {
        request({
          url: `${baseUrLs.transaction}`,
          method: 'get',
          params: {
            page: pagnation.current,
            limit: pagnation.pageSize,
            currency_type: payload.currency_type,
            end_date: payload.end_date,
            payment_type: payload.payment_type,
            start_date: payload.start_date,
            transaction_number: payload.transaction_number,
            account_number: payload.account_number
          }
        })
          .then(res => {
            // console.log(res)
            pagnation.total = +res.count
            resolve(res)
            commit('GET_TRLIST_ALL', res.billing_transactions)
            commit('TRPAGNATION', pagnation)
          })
          .catch(err => {
            reject(err)
          })
      })
    }
  }
}
export default reports
