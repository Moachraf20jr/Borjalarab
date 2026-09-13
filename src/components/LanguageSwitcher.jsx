import { useLanguage } from '../i18n/LanguageContext'

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage()
  return (
    <div
      className="lang-switcher"
      role="group"
      aria-label="Language / اللغة"
    >
      <button
        type="button"
        className={lang === 'ar' ? 'active' : ''}
        onClick={() => setLang('ar')}
        aria-pressed={lang === 'ar'}
        aria-label="العربية"
      >
        عربي
      </button>
      <button
        type="button"
        className={lang === 'en' ? 'active' : ''}
        onClick={() => setLang('en')}
        aria-pressed={lang === 'en'}
        aria-label="English"
      >
        EN
      </button>
    </div>
  )
}