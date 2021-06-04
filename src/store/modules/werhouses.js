import request from '@/utils/request'
// eslint-disable-next-line camelcase
const base_url = 'https://api.staff.macbro.uz/v1'

const werhouses = {
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
    getWerhousList ({ commit, state }, page) {
      if (!page) {
        page = { current: 1, pageSize: 10, total: null }
      }
      return new Promise((resolve, reject) => {
        request({
          // eslint-disable-next-line camelcase
          url: `${base_url}/inventory-party`,
          params: { page: page.current, limit: page.pageSize }
        })
          .then(result => {
            resolve(result)
          })
          .catch(error => {
           reject(error)
          })
      })
    },
    getWerhousListId ({ commit }, page) {
      return new Promise((resolve, reject) => {
        console.log(page)
        request({
          // eslint-disable-next-line camelcase
          url: `${base_url}/inventory-party/${page}`,
          params: { page: page.current, limit: page.pageSize }
        })
          .then(result => {
                resolve(result)
                })
          .catch(error => {
                reject(error)
             })
      })
    }
}
}
  export default werhouses
