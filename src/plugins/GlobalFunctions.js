import Vue from 'vue'
import './Converters'
const DateFormat = {
  install (Vue, options) {
    Vue.prototype.$date = data => {
      return new Date(data)
    }

    Vue.prototype.$getBase64 = file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = error => reject(error)
      })
    }

    Vue.prototype.$alertMessage = (type = 'success', title = '', desc = '', t) => {
        t.$notification[type]({
          message: title,
          description: desc,
          duration: 2
        })
    }

    Vue.prototype.$deleteFromList = (arr, id) => {
      arr.splice(arr.findIndex(el => el.id === id), 1)
  }

    Vue.prototype.$isNewForm = (params) => {
      if (Object.keys(params).length === 0 && params.constructor === Object) {
        return true
      } else return false
    }

    Vue.prototype.$setupQuery = (t) => {
      if (t.$isNewForm(t.$route.query)) { t.$router.push({ path: t.$route.fullPath, query: { offset: (t.pagination.current - 1) * 10, limit: 10 } }) }
      t.pagination.current = (t.$route.query.offset / t.$route.query.limit) + 1
    }

    Vue.prototype.$uploadImage = async (file, fileList, t) => {
      const formData = new FormData()
      formData.append('file', file)
      const url = await t.$getBase64(file)
      t.$store.dispatch('uploadFile', formData).then(res => {
        console.log(res)
        fileList.push({
          uid: res.filename,
          name: res.filename,
          status: 'done',
          url: url
        })
        console.log(fileList)
      }).catch(err => console.log(err))
    }
  }
}

Vue.use(DateFormat)
