import request from '@/utils/request'
const baseUrl = 'https://test.api.staff.macbro.uz/v1'
const baseUrLs = {
  transaction: '/billing/transaction'
}
const reports = {
  state: {
    transactionList: [],
    TrPagination: {}
  },
  getters: {
    transactionList: state => state.transactionList,
    TrPagination: state => state.TrPagination
  },
  mutations: {
    GET_TRLIST_ALL: (state, payload) => {
      state.transactionList = payload
    },
    TRPAGNATION: (state, payload) => {
      state.TrPagination = payload
    }
  },
  actions: {
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
