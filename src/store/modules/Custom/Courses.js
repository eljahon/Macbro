import request from '@/utils/request'

const jobs = {
    state: {
      courses: []
    },
    getters: {
      getCourses: state => state.courses
    },
    mutations: {
        SET_COURSES (state, payload) {
            state.courses = payload
        }
    },
    actions: {
      getCourses ({ commit }, page) {
        return new Promise((resolve, reject) => {
        request({
            url: 'v1/course',
            method: 'get'
        })
          .then(result => {
          commit('SET_COURSES', result.courses)
          resolve(result.courses)
        })
        .catch(error => {
          reject(error)
        })
      })
    },
    getCourse ({ commit }, id) {
      return new Promise((resolve, reject) => {
        request({
          url: 'v1/course/' + id
        }).then(res => {
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },
    postCourse ({ commit }, data) {
      return new Promise((resolve, reject) => {
      request({
          url: 'v1/course',
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
  updateCourse ({ commit }, data) {
    return new Promise((resolve, reject) => {
    request({
        url: 'v1/course/' + data.id,
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
  deleteCourse ({ commit }, id) {
  return new Promise((resolve, reject) => {
    request({
        url: 'v1/course/' + id,
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
