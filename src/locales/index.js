import Vue from 'vue'
import VueI18n from 'vue-i18n'
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import ElementLocale from 'element-ui/lib/locale'

console.log('初始多语言')
Vue.use(VueI18n)

const DEFAULT_LANG = 'zh'
const LOCALE_KEY = 'localeLanguage'

const locales = {
  zh: {
    ...require('./zh.json'),
    ...zhLocale
  },
  en: {
    ...require('./en.json'),
    ...enLocale
  },
}

const i18n = new VueI18n({
  locale: DEFAULT_LANG,
  messages: locales,
})
ElementLocale.i18n((key, value) => i18n.t(key, value))
export const setup = lang => {
  if (lang === undefined) {
    lang = window.localStorage.getItem(LOCALE_KEY) || DEFAULT_LANG
  }
  window.localStorage.setItem(LOCALE_KEY, lang)
  console.log('lang',lang);

  Object.keys(locales).forEach(lang => {
    document.body.classList.remove(`lang-${lang}`)
  })
  document.body.classList.add(`lang-${lang}`)
  document.body.setAttribute('lang', lang)

  Vue.config.lang = lang
  i18n.locale = lang
}
var lang = navigator.language || navigator.userLanguage;
lang = lang.substr(0, 2);
if (lang != 'zh') {
  lang = 'en';
}
setup(window.localStorage.getItem(LOCALE_KEY) || lang)
export default i18n
