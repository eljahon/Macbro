import request from '@/utils/request'

const jobs = {
    state: {
      languages: []
    },
    getters: {
      getLanguages: state => state.languages
    },
    mutations: {
        SET_LANGS (state, payload) {
            state.languages = payload
        }
    },
    actions: {
      getLangs ({ commit }) {
        return new Promise((resolve, reject) => {
        request({
            url: 'v1/settings',
            method: 'get'
        })
          .then(result => {
            resolve(result.language)
        //   commit('SET_JOBS', result.jobs)
        })
        .catch(error => {
          reject(error)
        })
      })
    },
    getBaseUrl ({ commit }) {
      return new Promise((resolve, reject) => {
      request({
          url: 'v1/settings',
          method: 'get'
      })
        .then(result => {
          resolve(result.url)
      //   commit('SET_JOBS', result.jobs)
      })
      .catch(error => {
        reject(error)
      })
    })
  },
  getFileInfo ({ commit }, url) {
    return new Promise((resolve, reject) => {
    request({
        url,
        method: 'get'
    })
      .then(result => {
        resolve(result)
    //   commit('SET_JOBS', result.jobs)
    })
    .catch(error => {
      reject(error)
    })
  })
}
  }
}
  export default jobs
