import request from '@/utils/request'
const customUrl = 'v1/videoinfo'
const video = {
    actions: {
    getVideoInfo ({ commit }, id) {
      return new Promise((resolve, reject) => {
        request({
          url: customUrl + '/' + id
        }).then(res => {
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}
  export default video
