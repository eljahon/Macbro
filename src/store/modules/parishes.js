import request from '@/utils/request'
// eslint-disable-next-line camelcase
const base_Url = {
  parishes: '/history/prixod',
  catigoriya: '/category',
  product: '/product',
    groupped: '/product/variants-groupped',
  slugid: '/inventory-party/check',
  slugListItem: '/inventory-party/check-frequent'
}
const Parishes = {
  state: {
    parishesList: [],
    parishesPagination: {}
  },
  getters: {
    parishesPagination: state => state.parishesPagination,
    parishesList: state => state.parishesList
  },
  mutations: {
    PARISHES_LIST: (state, payload) => {
      state.parishesList = payload
    },
    PARISHES_PAGINATION: (state, payload) => {
      state.parishesPagination = payload
    }
  },
  actions: {
    getAllListParishes ({ commit }, payload) {
      const { page } = payload
      return new Promise((resolve, reject) => {
        request({
          url: `${base_Url.parishes}`,
          method: 'get',
          params: {
            limit: page.pageSize,
            page: page.current,
            from_date: payload.from_date,
            to_date: payload.to_date
          }
        })
          .then(res => {
            resolve(res)
            page.total = parseInt(res.count)
            console.log('===========', res.parties)
            commit('PARISHES_LIST', res.parties)
            commit('PARISHES_PAGINATION', page)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    getAllListCatigoriya ({ commit }) {
      return new Promise((resolve, reject) => {
        request({
          url: `${base_Url.catigoriya}`,
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
     getAllListPraductList ({ commit }, id) {
       const { param } = id
      return new Promise((resolve, reject) => {
        request({
          url: `${base_Url.product}`,
          method: 'get',
          params: {
            category: id.id,
            item_left: param === true ? 'part' : 'full'
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
    getAllListPraductListItemInside ({ commit }, id) {
      return new Promise((resolve, reject) => {
        request({
          url: `${base_Url.product}/${id}`,
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
    getAllListPraductListItemInsideFull ({ commit }, id) {
      return new Promise((resolve, reject) => {
        request({
          url: `${base_Url.groupped}`,
          method: 'get',
          params: {
            id: id
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
    slugId ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        request({
          url: `${base_Url.slugid}`,
          method: 'post',
          data: {
            product_slugs: payload
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
    partiabalItemList ({ commit }, data) {
      return new Promise((resolve, reject) => {
        request({
          url: `${base_Url.slugListItem}`,
          method: 'post',
          data: {
            group_names: data
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
export default Parishes
