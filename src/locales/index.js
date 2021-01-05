import Vue from 'vue'
import VueI18n from 'vue-i18n'
import storage from 'store'
import moment from 'moment'

// default lang
import ruRU from './lang/ru-RU'

Vue.use(VueI18n)

export const defaultLang = 'ru-RU'

const messages = {
  'ru-RU': {
    ...ruRU
  }
}

const i18n = new VueI18n({
  silentTranslationWarn: true,
  locale: defaultLang,
  fallbackLocale: defaultLang,
  messages
})

const loadedLanguages = [defaultLang]

function setI18nLanguage (lang) {
  i18n.locale = lang
  // request.headers['Accept-Language'] = lang
  document.querySelector('html').setAttribute('lang', lang)
  return lang
}

export function loadLanguageAsync (lang = defaultLang) {
  return new Promise(resolve => {
    // 缓存语言设置
    storage.set('lang', lang)
    if (i18n.locale !== lang) {
      if (!loadedLanguages.includes(lang)) {
        return import(/* webpackChunkName: "lang-[request]" */ `./lang/${lang}`).then(msg => {
          const locale = msg.default
          i18n.setLocaleMessage(lang, locale)
          loadedLanguages.push(lang)
          moment.updateLocale(locale.momentName, locale.momentLocale)
          return setI18nLanguage(lang)
        })
      }
      return resolve(setI18nLanguage(lang))
    }
    return resolve(lang)
  }).catch(err => {
    console.log(err)
  })
}

export function i18nRender (key) {
  return i18n.t(`${key}`)
}

export default i18n
