import request from '@/utils/request'
const customUrl = 'v1/course'

const lessons = {
    state: {
      lessons: []
    },
    getters: {
      getLessons: state => state.lessons
    },
    mutations: {
        SET_LESSONS (state, payload) {
            state.lessons = payload
        }
    },
    actions: {
      sortLessons ({ commit }, data) {
        return new Promise((resolve, reject) => {
          request({
              url: `${customUrl}/${data.course_id}/chapter/${data.chapter_id}/sort-lessons`,
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
      getLessons ({ commit }, data) {
        return new Promise((resolve, reject) => {
        request({
            url: `${customUrl}/${data.course_id}/chapter/${data.chapter_id}/lesson`,
            method: 'get'
        })
          .then(result => {
            resolve(result)
          commit('SET_LESSONS', result.Lessons)
        })
        .catch(error => {
          reject(error)
        })
      })
    },
    getLesson ({ commit }, data) {
      return new Promise((resolve, reject) => {
      request({
          url: `${customUrl}/${data.course_id}/chapter/${data.chapter_id}/lesson/${data.lesson_id}`,
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
  },
    postLesson ({ commit }, data) {
        return new Promise((resolve, reject) => {
        request({
            url: `${customUrl}/${data.course_id}/chapter/${data.chapter_id}/lesson`,
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
    updateLesson ({ commit }, data) {
      return new Promise((resolve, reject) => {
      request({
          url: `${customUrl}/${data.course_id}/chapter/${data.chapter_id}/lesson/${data.lesson_id}`,
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
  deleteLesson ({ commit }, data) {
    return new Promise((resolve, reject) => {
    request({
      url: `${customUrl}/${data.course_id}/chapter/${data.chapter_id}/lesson/${data.lesson_id}`,
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
  export default lessons
