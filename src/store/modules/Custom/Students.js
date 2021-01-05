import request from '@/utils/request'
const customUrl = 'v1/student'
const students = {
    state: {
      students: []
    },
    getters: {
      getStudents: state => state.students
    },
    mutations: {
        SET_STUDENTS (state, payload) {
            state.students = payload
        }
    },
    actions: {
        getStudents ({ commit }, params) {
        return new Promise((resolve, reject) => {
        request({
            url: customUrl,
            method: 'get',
            params
        })
          .then(result => {
            resolve(result)
          commit('SET_STUDENTS', result.students)
        })
        .catch(error => {
          reject(error)
        })
      })
    },
    getStudent ({ commit }, id) {
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
    postStudent ({ commit }, data) {
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
    updateStudent ({ commit }, data) {
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
  deleteStudent ({ commit }, id) {
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
  export default students
