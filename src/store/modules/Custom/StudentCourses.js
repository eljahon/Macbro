import request from '@/utils/request'
const customUrl = 'v1/student-course'
const students = {
    state: {
      studentCourse: []
    },
    getters: {
      getStudentCourse: state => state.studentCourse
    },
    mutations: {
        SET_STUDENTS_COURSE (state, payload) {
            state.studentCourse = payload
        }
    },
    actions: {
        getStudentCourses ({ commit }) {
        return new Promise((resolve, reject) => {
        request({
            url: customUrl,
            method: 'get'
        })
          .then(result => {
            resolve(result.student_courses)
          commit('SET_STUDENTS_COURSE', result.student_courses)
        })
        .catch(error => {
          reject(error)
        })
      })
    },
    getStudentCourse ({ commit }, id) {
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
    postStudentCourse ({ commit }, data) {
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
    updateStudentCourse ({ commit }, data) {
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
  deleteStudentCourse ({ commit }, id) {
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
