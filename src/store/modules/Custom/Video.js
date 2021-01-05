import request from '@/utils/request'
const customUrl = 'v1/video'
const jobs = {
    state: {
      videos: []
    },
    getters: {
      getVideos: state => state.videos
    },
    mutations: {
        SET_VIDEOS (state, payload) {
            state.videos = payload
        }
    },
    actions: {
      getVideos ({ commit }) {
        return new Promise((resolve, reject) => {
        request({
            url: customUrl,
            method: 'get'
        })
          .then(result => {
          commit('SET_VIDEOS', result.videos)
          resolve(result.videos)
        })
        .catch(error => {
          reject(error)
        })
      })
    },
    getVideo ({ commit }, id) {
      return new Promise((resolve, reject) => {
        request({
          url: customUrl + '/' + id
        }).then(res => {
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },
    postVideo ({ commit }, data) {
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
  updateVideo ({ commit }, data) {
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
  deleteVideo ({ commit }, id) {
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
