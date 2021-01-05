import request from '@/utils/request'
const customUrl = 'v1/course'
const chapter = {
    state: {
        chapters: []
    },
    getters: {
      getChapters: state => state.chapters
    },
    mutations: {
        SET_CHAPTERS (state, payload) {
            state.contacts = payload
        }
    },
    actions: {
      sortChapters ({ commit }, data) {
        return new Promise((resolve, reject) => {
          request({
            url: `${customUrl}/${data.course_id}/sort-chapters`,
              method: 'post',
              data
          })
            .then(result => {
              resolve(result)
          })
          .catch(error => {
            reject(error)
          })
        })
      },
    getChapters ({ commit }, courseId) {
        return new Promise((resolve, reject) => {
        request({
            url: `${customUrl}/${courseId}/chapter`,
            method: 'get'
        })
          .then(result => {
            commit('SET_CHAPTERS', result.chapters)
            resolve(result.chapters)
        })
        .catch(error => {
          reject(error)
        })
      })
    },
    getChapter ({ commit }, data) {
      return new Promise((resolve, reject) => {
      request({
          url: `${customUrl}/${data.course_id}/chapter/${data.chapter_id}`,
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
    postChapters ({ commit }, data) {
        console.log(chapter)
        return new Promise((resolve, reject) => {
        request({
            url: `${customUrl}/${data.courseId}/chapter`,
            method: 'post',
            data: data.chapter
        })
          .then(result => {
            resolve(result)
        })
        .catch(error => {
          reject(error)
        })
      })
    },
    updateChapters ({ commit }, data) {
        return new Promise((resolve, reject) => {
        request({
            url: `${customUrl}/${data.courseId}/chapter/${data.chapter.id}`,
            method: 'put',
            data: data.chapter
        })
          .then(result => {
            resolve(result)
        })
        .catch(error => {
          reject(error)
        })
      })
    },
    deleteChapter ({ commit }, chapter) {
        return new Promise((resolve, reject) => {
        request({
            url: `${customUrl}/${chapter.courseId}/chapter/${chapter.chapterId}`,
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
  export default chapter
