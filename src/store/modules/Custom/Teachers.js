import request from '@/utils/request'
const customUrl = 'v1/teacher'
const teachers = {
    state: {
      teachers: []
    },
    getters: {
      getTeachers: state => state.teachers
    },
    mutations: {
        SET_TEACHER (state, payload) {
            state.teachers = payload
        }
    },
    actions: {
      getTeachers ({ commit }) {
        return new Promise((resolve, reject) => {
        request({
            url: customUrl,
            method: 'get'
        })
          .then(result => {
            resolve(result.teachers)
          commit('SET_TEACHER', result.teachers)
        })
        .catch(error => {
          reject(error)
        })
      })
    },
    getTeacher ({ commit }, id) {
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
    postTeacher ({ commit }, data) {
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
    updateTeacher ({ commit }, data) {
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
  deleteTeacher ({ commit }, id) {
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
  export default teachers
