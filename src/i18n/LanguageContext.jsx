import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react'
import { translations, CATEGORY_KEY, ARTICLE_CATEGORY_KEY } from './translations'

const LanguageContext = createContext(null)

const STORAGE_KEY = 'burj_lang'

export const LanguageProvider = ({ children }) => {
  const [lang, setLangState] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'en' ? 'en' : 'ar'
    } catch {
      return 'ar'
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      // storage unavailable
    }
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
  }, [lang])

  const setLang = useCallback((next) => {
    setLangState(next === 'en' ? 'en' : 'ar')
  }, [])

  const t = useCallback((key, params) => {
    const dict = translations[lang] || translations.ar
    const fallback = translations.ar[key]
    let text = dict[key] ?? fallback ?? key
    if (params) {
      Object.keys(params).forEach((k) => {
        text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), params[k])
      })
    }
    return text
  }, [lang])

  const value = useMemo(() => ({ lang, dir: lang === 'ar' ? 'rtl' : 'ltr', setLang, t }), [lang, setLang, t])

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}

export const localized = (doc, field, lang) => {
  if (!doc) return ''
  const enVal = doc[`${field}En`]
  const arVal = doc[field]
  if (lang === 'en') return enVal || arVal || ''
  return arVal || enVal || ''
}

export const localizedList = (doc, field, lang) => {
  if (!doc) return []
  const enList = doc[`${field}En`]
  const arList = doc[field]
  const list = lang === 'en' ? (enList && enList.length ? enList : arList) : (arList && arList.length ? arList : enList)
  return list || []
}

export const localizedCategory = (doc, lang, t) => {
  if (!doc) return ''
  const cat = doc.category
  if (!cat) return ''
  if (lang === 'en') {
    if (doc.categoryEn) return doc.categoryEn
    const key = CATEGORY_KEY[cat]
    if (key) return t(key)
    return ARTICLE_CATEGORY_KEY[cat] || cat
  }
  return cat
}

export const formatLocalizedDate = (dateString, lang) => {
  if (!dateString) return ''
  const locale = lang === 'ar' ? 'ar-SA' : 'en-GB'
  return new Date(dateString).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}