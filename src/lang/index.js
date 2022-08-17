import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Cookies from 'js-cookie'
import elementEnLocale from 'element-ui/lib/locale/lang/en' // element-ui lang
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN'// element-ui lang
import enLocale from '../locales/en/en'
import zhLocale from '../locales/zh/zh'

Vue.use(VueI18n)

const messages = {
  en: {
    ...enLocale,
    ...elementEnLocale
  },
  zh: {
    ...zhLocale,
    ...elementZhLocale
  }
}

const i18n = new VueI18n({
  // 设置语言 选项 en | zh
  locale: Cookies.get('language') || 'zh',
  // 设置文本内容
  messages,
  silentTranslationWarn: true
})

export const getKey = (key) => {
  var v = Cookies.get('language') || 'zh'
  //console.log("key==", key)
  //console.log("v==", v)
  if (v == 'en') {
    //console.log("enLocale[key]==", messages.en[key])
    return enLocale[key]
  } else {
    //console.log("enLocale[key]==", messages.zh[key])
    return zhLocale[key]
  }
}

export default i18n
