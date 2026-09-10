import zh from '../../Resources/i18n/plugin/zh.json'
import de from '../../Resources/i18n/plugin/de.json'
import ja from '../../Resources/i18n/plugin/ja.json'
import ko from '../../Resources/i18n/plugin/ko.json'
import en from '../../Resources/i18n/plugin/en.json'
import ru from '../../Resources/i18n/plugin/ru.json'
import es from '../../Resources/i18n/plugin/es.json'
import hk from '../../Resources/i18n/plugin/hk.json'
import pt from '../../Resources/i18n/plugin/pt.json'
import fr from '../../Resources/i18n/plugin/fr.json'
import cs from '../../Resources/i18n/plugin/cs.json'

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    zh: { translation: zh },
    de: { translation: de },
    ja: { translation: ja },
    ko: { translation: ko },
    ru: { translation: ru },
    es: { translation: es },
    hk: { translation: hk },
    pt: { translation: pt },
    fr: { translation: fr },
    cs: { translation: cs }
  },
  lng: 'zh',
  interpolation: {
    escapeValue: false
  },
  fallbackLng: 'en'
})

export default i18n
