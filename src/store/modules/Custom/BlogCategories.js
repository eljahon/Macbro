import request from '@/utils/request'
const customUrl = '/v1/blogcategory'
const blogCategory = {
    state: {
        blogCategory: []
    },
    getters: {
        getBlogCategory: state => state.blogCategory
    },
    mutations: {
        SET_BLOG_CATEGORY (state, payload) {
            state.blogCategory = payload
        }
    },
    actions: {
        getBlogCategories ({ commit }, page) {
        return new Promise((resolve, reject) => {
        request({
            url: customUrl,
            method: 'get'
        })
          .then(result => {
          commit('SET_BLOG_CATEGORY', result.blogcategories)
          resolve(result.blogcategories)
        })
        .catch(error => {
          reject(error)
        })
      })
    },
    getBlogCategory ({ e }, id) {
        return new Promise((resolve, reject) => {
            request({
                url: `${customUrl}/${id}`,
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
    postBlogCategory ({ commit }, data) {
        return new Promise((resolve, reject) => {
        request({
            url: customUrl,
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
    updateBlogCategory ({ commit }, data) {
        return new Promise((resolve, reject) => {
        request({
            url: `${customUrl}/${data.id}`,
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
    deleteBlogCategory ({ commit }, id) {
        return new Promise((resolve, reject) => {
        request({
            url: `${customUrl}/${id}`,
            method: 'delete'
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
  export default blogCategory
