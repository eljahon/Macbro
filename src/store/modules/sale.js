import request from '@/utils/request'
// eslint-disable-next-line camelcase
const base_Url = {
  online: '/order-online',
  ofline: '/history/prodaja',
  ofLineTabTwo: '/order-offline',
  ipateka: '/history/zaklad',
  orderitem: '/history/prodaja',
  ipatekaItem: '/history/zaklad',
  branch: '/branch'
}
const Sale = {
  state: {
    saleTabListOne: [],
    activTab: 1,
    saleTabOnePagination: {},
    saleTabTwoList: [],
    saleTabTwoPagination: {},
    saleTabTheeList: [],
    saleTabTheePagnation: {},
    insideTwoPagination: {},
    insideTwoListOne: [],
    oflineListTab: [],
    oflinePagination: {},
    ipatekaList: [],
    ipatekaPagination: {}
  },
  getters: {
    activTab: state => state.activTab,
    oflineListTabData: state => state.oflineListTab,
    oflinePagination: state => state.oflinePagination,
    saleTabListOne: state => state.saleTabListOne,
    saleTabListOnePagination: state => state.saleTabOnePagination,
    saleTabListTwo: state => state.saleTabTwoList,
    saleTabListTwoPagination: state => state.saleTabTwoPagination,
    saleTabListThee: state => state.saleTabTheeList,
    saleTabListTheePagination: state => state.saleTabTheePagnation,
    ipatekaPagination: state => state.ipatekaPagination,
    ipatekaList: state => state.ipatekaList
  },
  mutations: {
     SALE_ALL_DATA_ONE: (state, payload) => {
      state.saleTabListOne = payload
    },
    SALE_PAGNTION_ONE: (state, payload) => {
      state.saleTabOnePagination = payload
    },
    SALE_PAGNTION_THEE: (state, payload) => {
      state.saleTabTheePagnation = payload
    },
    SET_ACTIVE_TAB: (state, payload) => {
       state.activTab = payload
    },
    OFLINE_PAGNTION: (state, payload) => {
       state.oflinePagination = payload
    },
    OFLINE_ALL_DATA: (state, payload) => {
       state.oflineListTab = payload
    },
    IPATEKA_LIST: (state, payload) => {
       state.ipatekaList = payload
    },
    IPATEKA_PAGINATION: (state, payload) => {
       state.ipatekaPagination = payload
    }
  },
  actions: {
    getSaleListAllTabOne ({ commit }, payload) {
      const { page } = payload
    return new Promise((resolve, reject) => {
        request({
          url: `${base_Url.online}`,
          method: 'get',
          params: {
            page: page.current,
            limit: page.pageSize,
            from_date: payload.from_date,
            to_date: payload.to_date
          }
        })
          .then(res => {
            page.total = parseInt(res.count)
            commit('SALE_PAGNTION_ONE', page)
            commit('SALE_ALL_DATA_ONE', res.orders)
            resolve(res)
            console.log(res)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    OflineTwoInsideTabs ({ commit }, payload) {
      const { page } = payload
      return new Promise((resolve, reject) => {
        request({
          url: `${base_Url.ofline}`,
          method: 'get',
          params: {
            limit: page.pageSize,
            page: page.current
          }
        })
          .then(res => {
            resolve(res)
            commit('SALE_PAGNTION_TWO_INSIDE_ONE_PAGINATION', page)
            commit('SALE_ALL_DATA_TWO', res)
            console.log(res)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    OflineTabList ({ commit }, payload) {
      const { page } = payload
      return new Promise((resolve, reject) => {
        request({
          url: `${base_Url.ofLineTabTwo}`,
          method: 'get',
          params: {
            limit: page.pageSize,
            page: page.current,
            type: 'order',
            number: payload.number,
            statuses: payload.statuses,
            from_date: payload.from_date,
            to_date: payload.to_date,
            sender_warehouse_id: payload.sender_warehouse_id
          }
        })
          .then(res => {
            resolve(res)
            page.total = parseInt(res.count)
            commit('OFLINE_PAGNTION', page)
            commit('OFLINE_ALL_DATA', res.orders)
            console.log(res)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    IpatekaListgetAll ({ commit }, payload) {
      const { page } = payload
      return new Promise((resolve, reject) => {
        request({
          url: `${base_Url.ipateka}`,
          method: 'get',
          params: {
            limit: page.pageSize,
            page: page.current,
            from_date: payload.from_date,
            to_date: payload.to_date
          }
        })
          .then(res => {
            page.total = parseInt(res.count)
            resolve(res)
            commit('IPATEKA_PAGINATION', page)
            commit('IPATEKA_LIST', res.orders)
            console.log(res)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    getSaleListAllTabThee ({ commit }, payload) {
      const { page } = payload
      return new Promise((resolve, reject) => {
        request({
          url: `${base_Url.sale}`,
          method: 'get',
          params: payload
        })
          .then(res => {
            commit('SALE_PAGNTION_THEE', page)
            commit('SALE_ALL_DATA_THEE', res)
            console.log(res)
          })
      })
    },
    setAcriveTab ({ commit }, payload) {
      commit('SET_ACTIVE_TAB', payload)
    },
    itemGetAllList ({ commit }, id) {
      return new Promise((resolve, reject) => {
        request({
          url: `${base_Url.orderitem}/${id}`,
          method: 'get'
        })
          .then(res => {
            resolve(res)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    itemsIpatekaList ({ commit }, id) {
      return new Promise((resolve, reject) => {
        request({
          url: `${base_Url.ipatekaItem}/${id}`,
          method: 'get'
        })
          .then(res => {
            resolve(res)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    getBranchList ({ commit }) {
      return new Promise((resolve, reject) => {
        request({
          url: `${base_Url.branch}`,
          method: 'get',
          params: {
            page: 1,
            limit: 100
          }
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
export default Sale
