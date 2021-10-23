import request from '@/utils/request'
// eslint-disable-next-line camelcase
const base_Url = {
  parishes: '/history/prixod',
  catigoriya: '/category',
  product: '/product',
  groupped: '/product-variants-groupped',
  slugid: '/inventory-party/check',
  slugListItem: '/inventory-party/check-frequent',
  ima: '/inventory-item/scanned'
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
    getAllParishes ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        request({
          url: `${base_Url.parishes}`,
          method: 'get',
          params: payload
        })
          .then(res => {
            resolve(res)
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
    },
    getItemParishesList ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        request({
          url: `${base_Url.parishes}/${payload}`,
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
    gerImacodeListAll ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        request({
          url: `${base_Url.ima}`,
          method: 'get',
          params: {
            ...payload
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
