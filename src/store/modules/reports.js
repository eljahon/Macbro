import request from '@/utils/request'
const baseUrl = 'https://test.api.staff.macbro.uz/v1'
const baseUrLs = {
  transaction: '/billing/transaction',
  acountList: '/billing/account',
  SubacountList: '/billing/subaccount',
  espenList: '/billing/expenditure'
}
const reports = {
  state: {
    EspaneGetAllList: [],
    EspenPagination: {},
    AcPagination: {},
    AcountList: [],
    SubAcountList: [],
    SunPagnation: {},
    transactionList: [],
    TrPagination: {}
  },
  getters: {
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
    GetEspenListAll ({ commit }, payload) {
      const pagination = payload.page
      return new Promise((resolve, reject) => {
        request({
          url: `${baseUrl}${baseUrLs.espenList}`,
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
          url: `${baseUrl}${baseUrLs.SubacountList}`,
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
          url: `${baseUrl}${baseUrLs.acountList}`,
          method: 'get',
          params: {
            page: pagination.current,
            limit: pagination.pageSize,
            search: payload.search

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
          url: `${baseUrl}${baseUrLs.transaction}`,
          method: 'get',
          params: {
            page: pagnation.current,
            limit: pagnation.pageSize,
            currency_type: payload.currency_type,
            end_date: payload.end_date,
            payment_type: payload.payment_type,
            start_date: payload.start_date
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
