import request from '@/utils/request'

const categories = {
    state: {
      categories: []
    },
    getters: {
      categories: state => state.categories
    },
    mutations: {
        SET_CATEGORIES (state, payload) {
            state.categories = payload
        }
    },
    actions: {
        getCategories ({ commit }, page) {
        return new Promise((resolve, reject) => {
        request({
            url: 'v1/category',
            method: 'get'
        })
          .then(result => {
          commit('SET_CATEGORIES', result.categories)
          resolve(result.categories)
        })
        .catch(error => {
          reject(error)
        })
      })
    },
    getCategory ({ e }, id) {
        return new Promise((resolve, reject) => {
            request({
                url: 'v1/category/' + id,
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
    postCategory ({ commit }, data) {
        return new Promise((resolve, reject) => {
        request({
            url: 'v1/category',
            method: 'post',
            data: data
        })
          .then(result => {
          resolve(result)
        })
        .catch(error => {
          reject(error)
        })
      })
    },
    updateCategory ({ commit }, data) {
        return new Promise((resolve, reject) => {
        request({
            url: 'v1/category/' + data.id,
            method: 'put',
            data: data
        })
          .then(result => {
          resolve(result)
        })
        .catch(error => {
          reject(error)
        })
      })
    },
    deleteCategory ({ commit }, id) {
        return new Promise((resolve, reject) => {
        request({
            url: 'v1/category/' + id,
            method: 'delete'
        })
          .then(result => {
          resolve(result)
        })
        .catch(error => {
          reject(error)
        })
      })
    },
    uploadFile ({ commit }, formData) {
      return new Promise((resolve, reject) => {
      request({
          url: 'v1/upload/image',
          method: 'post',
          data: formData
      })
        .then(result => {
        resolve(result)
      })
      .catch(error => {
        reject(error)
      })
    })
  },
  uploadDocsFile ({ commit }, formData) {
    return new Promise((resolve, reject) => {
    request({
        url: 'v1/upload/notes',
        method: 'post',
        data: formData
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
  export default categories
