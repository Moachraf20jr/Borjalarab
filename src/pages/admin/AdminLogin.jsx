import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../i18n/LanguageContext'
import { Building2, Loader2, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useToast } from '../../hooks/useToast'

export default function AdminLogin() {
  const { login } = useAuth()
  const { success, error } = useToast()
  const { t, lang } = useLanguage()
  const location = useLocation()
  const navigate = useNavigate()
  const from = location.state?.from?.pathname || '/admin/dashboard'

  const [formData, setFormData] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const isAr = lang === 'ar'

  const validateField = (name, value) => {
    switch (name) {
      case 'email':
        return !value ? t('admin.login.emailRequired') : !/^\S+@\S+\.\S+$/.test(value) ? t('admin.login.emailInvalid') : ''
      case 'password':
        return !value ? t('admin.login.passwordRequired') : value.length < 6 ? t('admin.login.passwordMin') : ''
      default:
        return ''
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (touched[name]) {
      setErrors(prev => ({ ...prev, [name]: validateField(name, value) }))
    }
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const newErrors = {}
    let hasErrors = false

    Object.keys(formData).forEach(key => {
      const err = validateField(key, formData[key])
      if (err) {
        newErrors[key] = err
        hasErrors = true
      }
    })

    setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}))
    setErrors(newErrors)

    if (hasErrors) return

    setIsLoading(true)
    try {
      await login(formData)
      success(t('admin.login.success'))
      navigate(from, { replace: true })
    } catch (err) {
      const message = err.response?.data?.message || t('admin.login.failed')
      error(message)
      setErrors({ form: message })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-6">
            <Building2 size={40} className="text-gold" aria-hidden="true" />
            <div className={`${isAr ? 'text-right' : 'text-left'}`}>
              <h1 className="text-2xl font-bold text-navy">{t('admin.brandName')}</h1>
              <p className="text-sm text-text-muted">{t('admin.brandSub')}</p>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-navy">{t('admin.login.title')}</h2>
          <p className="text-text-muted mt-2">{t('admin.login.subtitle')}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {errors.form && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700" role="alert">
              <AlertCircle size={20} aria-hidden="true" />
              <p>{errors.form}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-navy mb-2">
                  {t('admin.login.email')}
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="admin@example.com"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.email && touched.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-gold focus:ring-gold'
                    } focus:ring-2 focus:ring-offset-0 outline-none transition-colors`}
                    aria-invalid={errors.email && touched.email ? 'true' : 'false'}
                    aria-describedby={errors.email && touched.email ? 'email-error' : undefined}
                    disabled={isLoading}
                  />
                </div>
                {errors.email && touched.email && (
                  <p id="email-error" className="mt-1.5 text-sm text-red-600 flex items-center gap-1" role="alert">
                    <AlertCircle size={14} aria-hidden="true" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-navy mb-2">
                  {t('admin.login.password')}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="••••••••"
                    className={`w-full px-4 py-3 rounded-lg border ${isAr ? 'pr-12' : 'pl-12'} ${
                      errors.password && touched.password ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-gold focus:ring-gold'
                    } focus:ring-2 focus:ring-offset-0 outline-none transition-colors`}
                    aria-invalid={errors.password && touched.password ? 'true' : 'false'}
                    aria-describedby={errors.password && touched.password ? 'password-error' : undefined}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute ${isAr ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 text-text-muted hover:text-navy transition-colors`}
                    aria-label={showPassword ? t('admin.login.hidePassword') : t('admin.login.showPassword')}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && touched.password && (
                  <p id="password-error" className="mt-1.5 text-sm text-red-600 flex items-center gap-1" role="alert">
                    <AlertCircle size={14} aria-hidden="true" />
                    {errors.password}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-8 w-full py-3.5 rounded-lg btn-primary text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin mx-auto" aria-hidden="true" />
                  <span className="sr-only">{t('admin.login.loading')}</span>
                </>
              ) : (
                t('admin.login.submit')
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-text-muted mt-6">
          {t('admin.login.copyright', { year: new Date().getFullYear() })}
        </p>
      </div>
    </div>
  )
}