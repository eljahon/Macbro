import request from '@/utils/request'
// eslint-disable-next-line camelcase
const base_url = {
  rollcallget: '/journaling/report/list',
  transfer: '/order-offline',
  rollcallItem: '/journaling/by-user/list',
  transferItem: '/history/peremeshenie'
}
const rollcall = {
  state: {
    activTab: 1,
    rollCollList: [],
    rollcollPagination: {},
    trnseferList: [],
    trnseferListTabLisTwo: [],
    trnseferListTabLisThee: [],
    tronferPagination: {},
    tronferPaginationTabLisTwo: {},
    tronferPaginationTabLisThee: {}
  },
  getters: {
    activTab: state => state.activTab,
    tronferPagination: state => state.tronferPagination,
    trnseferList: state => state.trnseferList,
    trnseferListTabLisTwo: state => state.trnseferListTabLisTwo,
    tronferPaginationTabLisTwo: state => state.tronferPaginationTabLisTwo,
    tronferPaginationTabLisThee: state => state.tronferPaginationTabLisThee,
    trnseferListTabLisThee: state => state.trnseferListTabLisThee,
    rollCollList: state => state.rollCollList,
    rollcollPagination: state => state.rollcollPagination
  },
  mutations: {
    ACTIVE_TAB: (state, paylaod) => {
      state.activTab = paylaod
    },
    GET_ROLL_COLL_ALL_DATA: (state, payload) => {
      state.rollCollList = payload
    },
    Transfer_Get_All: (state, payload) => {
      state.trnseferList = payload
    },
    TRANSFER_TAB_LIST_TWO: (state, payload) => {
state.trnseferListTabLisTwo = payload
    },
    TRANSFER_TAB_LIST_TWO_PAGINATION: (state, payload) => {
      state.tronferPaginationTabLisTwo = payload
    },
    TRANSFER_TAB_LIST_THEE_PAGINATION: (state, payload) => {
      state.tronferPaginationTabLisThee = payload
    },
    TRANSFER_TAB_LIST_THEE: (state, payload) => {
      state.trnseferListTabLisThee = payload
    },
    Pagination: (state, payload) => {
      state.rollcollPagination = payload
    },
    TransferPagination: (state, payload) => {
      state.tronferPagination = payload
    }
  },
  actions: {
      getRollCollAll ({ commit }, payload) {
        const { page } = payload
      return new Promise((resolve, reject) => {
        request({
          url: `${base_url.rollcallget}`,
          method: 'get',
          params: {
            from_date: payload.from_date,
            to_date: payload.to_date,
            page: page.current,
            limit: page.pageSize,
            search: payload.search
          }
        })
          .then(res => {
            resolve(res)
            page.total = res.count
            commit('Pagination', page)
            console.log('========', res.user_journaling_report_items)
            commit('GET_ROLL_COLL_ALL_DATA', res.user_journaling_report_items)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    TransferGetAll ({ commit }, payload) {
        const { page } = payload
        return new Promise((resolve, reject) => {
          request({
            url: `${base_url.transfer}`,
            method: 'get',
            params: {
              statuses: payload.statuses,
              type: 'relocation',
              limit: page.pageSize,
              page: page.current,
              from_date: payload.from_date,
              to_date: payload.to_date
            }
          })
            .then(res => {
              resolve(res)
              page.total = parseInt(res.count)
              commit('Transfer_Get_All', res.orders)
              commit('TransferPagination', page)
              console.log('=======================', res)
            })
            .catch(error => {
              reject(error)
            })
        })
    },
    TransferGetAllTwoTab ({ commit }, payload) {
        const { page } = payload
        return new Promise((resolve, reject) => {
          request({
            url: `${base_url.transfer}`,
            method: 'get',
            params: {
              statuses: payload.statuses,
              type: 'relocation',
              limit: page.pageSize,
              page: page.current
            }
          })
            .then(res => {
              resolve(res)
              page.total = parseInt(res.count)
              commit('TRANSFER_TAB_LIST_TWO', res.orders)
              commit('TRANSFER_TAB_LIST_TWO_PAGINATION', page)
              console.log('=======================', res)
            })
            .catch(error => {
              reject(error)
            })
        })
    },
    TransferGetAllTheeTab ({ commit }, payload) {
        const { page } = payload
        return new Promise((resolve, reject) => {
          request({
            url: `${base_url.transfer}`,
            method: 'get',
            params: {
              statuses: payload.statuses,
              type: 'relocation',
              limit: page.pageSize,
              page: page.current,
              from_date: payload.from_date,
              to_date: payload.to_date
            }
          })
            .then(res => {
              resolve(res)
              page.total = res.count
              commit('TRANSFER_TAB_LIST_THEE', res.orders)
              commit('TRANSFER_TAB_LIST_THEE_PAGINATION', page)
              console.log('=======================', res)
            })
            .catch(error => {
              reject(error)
            })
        })
    },
    setAtiveTab ({ commit }, payload) {
        commit('ACTIVE_TAB', payload)
},
    rollCallItemListGet ({ comiit }, payload) {
        const { page } = payload
      console.log('===payoload ==>>', payload)
      return new Promise((resolve, reject) => {
          request({
            url: `${base_url.rollcallItem}`,
            method: 'get',
            params: {
              company_id: payload.company_id,
              branch_id: payload.branch_id,
              user_id: payload.user_id,
              from_date: payload.from_date,
              to_date: payload.to_date,
              page: page.current,
              limit: page.pageSize
            }
          })
            .then(res => {
              resolve(res)
            })
            .catch(error => {
              reject(error)
            })
        })
    },
    TransferListIdget ({ commit }, payload) {
        return new Promise((resolve, reject) => {
          request({
            url: `${base_url.transferItem}/${payload}`,
            method: 'get'
          })
            .then(res => {
              resolve(res)
            })
            .catch(error => {
              reject(error)
            })
        })
    }
  }
}
export default rollcall
