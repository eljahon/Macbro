import request from '@/utils/request'
const customUrl = 'v1/post'
const jobs = {
    state: {
      posts: []
    },
    getters: {
      getPosts: state => state.posts
    },
    mutations: {
        SET_POSTS (state, payload) {
            state.posts = payload
        }
    },
    actions: {
      getPosts ({ commit }) {
        return new Promise((resolve, reject) => {
        request({
            url: customUrl,
            method: 'get'
        })
          .then(result => {
            resolve(result.posts)
          commit('SET_PARTNER', result.posts)
        })
        .catch(error => {
          reject(error)
        })
      })
    },
    searchPosts ({ commit }, item) {
      return new Promise((resolve, reject) => {
        request({
            url: `${customUrl}?search=${item}`,
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
    getPost ({ commit }, id) {
      return new Promise((resolve, reject) => {
      request({
          url: customUrl + '/' + id,
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
    postPost ({ commit }, data) {
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
    updatePost ({ commit }, data) {
      return new Promise((resolve, reject) => {
      request({
          url: customUrl + '/' + data.id,
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
  deletePost ({ commit }, id) {
    return new Promise((resolve, reject) => {
    request({
        url: customUrl + '/' + id,
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
  export default jobs
