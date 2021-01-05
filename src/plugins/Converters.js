import Vue from 'vue'

const converters = {
  install (Vue, options) {
    Vue.prototype.$convertArrayToObject = (array, key) => {
        const initialValue = {}
        return array.reduce((obj, item) => ({ ...obj, [item[key]]: item.input }), initialValue)
    }

    Vue.prototype.$convertObjectToArray = (obj, lang) => {
        const arrayList = []
        for (const key in obj) {
         arrayList.push({
           [key]: obj[key],
           value: key,
           label: lang.langs.filter(el => el.value === key)[0].label,
           input: obj[key]
         })
        }
        return arrayList
    }
  }
}

Vue.use(converters)
