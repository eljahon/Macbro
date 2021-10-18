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
    insideTab: [],
    insidePagination: {},
    rollcollPagination: {},
    trnseferList: [],
    trnseferListTabLisTwo: [],
    complited: [],
    tronferPagination: {},
    tronferPaginationTabLisTwo: {},
    complitedPagnation: {},
    AllPagination: {},
    AllList: [],
    Accepted: [],
    AcceptedPagination: {},
    rejected: [],
    rejectedPagination: {}
  },
  getters: {
    rejected: state => state.rejected,
    rejectedPagination: state => state.rejectedPagination,
    accepted: state => state.Accepted,
    acceptedPagnation: state => state.AcceptedPagination,
    allList: state => state.AllList,
    allPagination: state => state.AllPagination,
    activTab: state => state.activTab,
    tronferPagination: state => state.tronferPagination,
    trnseferList: state => state.trnseferList,
    trnseferListTabLisTwo: state => state.trnseferListTabLisTwo,
    tronferPaginationTabLisTwo: state => state.tronferPaginationTabLisTwo,
    complitedPagnation: state => state.complitedPagnation,
    complited: state => state.complited,
    rollCollList: state => state.rollCollList,
    rollcollPagination: state => state.rollcollPagination
  },
  mutations: {
    REJECTED_LIST: (state, payload) => {
      state.rejected = payload
    },
    REJECTED_PAGINATION: (state, payload) => {
      state.rejectedPagination = payload
    },
    ACCEPTED_LIST: (state, payload) => {
      state.Accepted = payload
    },
    ACCEPTED_LIST_PAGINATION: (state, payload) => {
      state.AcceptedPagination = payload
    },
    INSIDE_TAB: (state, payload) => {
      state.insideTab = payload
    },
    INSIDE_TAB_PAGINATION: (state, payload) => {
      state.insidePagination = payload
    },
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
    COMPLITED_PAGINATION: (state, payload) => {
      state.complitedPagnation = payload
    },
    COMPLITED_LIST: (state, payload) => {
      state.complited = payload
    },
    Pagination: (state, payload) => {
      state.rollcollPagination = payload
    },
    TransferPagination: (state, payload) => {
      state.tronferPagination = payload
    },
    Get_All: (state, paylod) => {
      state.AllList = paylod
    },
    ALL_Pagination: (state, payload) => {
      state.AllPagination = payload
    }
  },
  actions: {
    getRollCollAll ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        request({
          url: `${base_url.rollcallget}`,
          method: 'get',
          params: {
            ...payload
          }
        })
          .then(res => {
            resolve(res)
            const page = {
              current: payload.page,
              pageSize: payload.limit,
              total: null
            }
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
      return new Promise((resolve, reject) => {
        request({
          url: `${base_url.transfer}`,
          method: 'get',
          params: {
            ...payload
          }
        })
          .then(res => {
            resolve(res)
            const page = {
              current: payload.page,
              pageSize: payload.limit,
              total: null
            }
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
    AllTabList ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        request({
          url: `${base_url.transfer}`,
          method: 'get',
          params: {
            ...payload
          }
        })
          .then(res => {
            resolve(res)
            const page = {
              current: payload.page,
              pageSize: payload.limit
            }
            page.total = parseInt(res.count)
            commit('Get_All', res.orders)
            commit('ALL_Pagination', page)
            console.log('=======================', res)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    AllTabListAccepted ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        request({
          url: `${base_url.transfer}`,
          method: 'get',
          params: {
            ...payload
          }
        })
          .then(res => {
            resolve(res)
            const page = {
              current: payload.page,
              pageSize: payload.limit
            }
            page.total = parseInt(res.count)
            commit('ACCEPTED_LIST', res.orders)
            commit('ACCEPTED_LIST_PAGINATION', page)
            console.log('=======================', res)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    AllTabListRejected ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        request({
          url: `${base_url.transfer}`,
          method: 'get',
          params: {
            ...payload
          }
        })
          .then(res => {
            resolve(res)
            const page = {
              current: payload.page,
              pageSize: payload.limit
            }
            page.total = parseInt(res.count)
            commit('REJECTED_LIST', res.orders)
            commit('REJECTED_PAGINATION', page)
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
    InsisdeGetAllTwoTab ({ commit }, payload) {
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
            commit('INSIDE_TAB', res.orders)
            commit('INSIDE_TAB_PAGINATION', page)
            console.log('=======================', res)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    TransferGetAllTheeTab ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        request({
          url: `${base_url.transfer}`,
          method: 'get',
          params: {
           ...payload
          }
        })
          .then(res => {
            resolve(res)
            const page = {
              current: payload.page,
              pageSize: payload.limit,
              total: null
            }
            page.total = res.count
            commit('COMPLITED_LIST', res.orders)
            commit('COMPLITED_PAGINATION', page)
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
