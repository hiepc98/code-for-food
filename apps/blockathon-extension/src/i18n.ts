import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { onChangeLanguage, store } from 'store'

import { languages } from '~config/lang'

const resources = {}

Object.keys(languages).forEach((lng) => {
  resources[lng] = {
    translation: languages[lng]
  }
})

const { setting } = store.getState()

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: setting.language || localStorage.getItem('lang') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  })

i18n.on('languageChanged', (lng) => {
  store.dispatch(onChangeLanguage(lng))
  localStorage.setItem('lang', lng)
})

export default i18n
