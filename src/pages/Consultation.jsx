import { useState } from 'react'
import PhoneInput from 'react-phone-number-input'
import { isValidPhoneNumber } from 'libphonenumber-js'
import 'react-phone-number-input/style.css'
import { consultationAPI } from '../services/api'
import { useLanguage } from '../i18n/LanguageContext'
import { projectTypeValue } from '../i18n/translations'
import PageHero from '../components/PageHero'
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { useToast } from '../hooks/useToast'

const projectTypes = ['residential', 'commercial', 'administrative', 'engineering', 'other']

const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default function Consultation() {
  const { t } = useLanguage()
  const { success, error } = useToast()
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    projectType: '',
    details: '',
  })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState('idle')

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        return value.trim().length < 2 ? t('cons.err.name') : ''
      case 'phone':
        return !isValidPhoneNumber(value) ? t('cons.err.phone') : ''
      case 'email':
        return !validateEmail(value) ? t('cons.err.email') : ''
      case 'projectType':
        return !value ? t('cons.err.type') : ''
      case 'details':
        return value.trim().length < 10 ? t('cons.err.details') : ''
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

  const handlePhoneChange = (value) => {
    setFormData(prev => ({ ...prev, phone: value || '' }))
    if (touched.phone) {
      setErrors(prev => ({ ...prev, phone: validateField('phone', value || '') }))
    }
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }))
  }

  const handlePhoneBlur = () => {
    setTouched(prev => ({ ...prev, phone: true }))
    setErrors(prev => ({ ...prev, phone: validateField('phone', formData.phone) }))
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

    setIsSubmitting(true)
    try {
      await consultationAPI.create(formData)
      setSubmitStatus('success')
      setFormData({ name: '', phone: '', email: '', projectType: '', details: '' })
      setTouched({})
      success(t('cons.success.desc'))
    } catch (err) {
      const message = err.response?.data?.message || t('cons.err.generic')
      error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <PageHero
        label={t('cons.hero.label')}
        title={t('cons.hero.title')}
        description={t('cons.hero.desc')}
      />
      <section className="section consultation-section" aria-labelledby="form-title">
        <div className="container">
          <div className="consultation-wrapper">
            {submitStatus === 'success' ? (
              <div className="success-message" role="alert">
                <CheckCircle size={48} className="success-icon" aria-hidden="true" />
                <h3>{t('cons.success.title')}</h3>
                <p>{t('cons.success.desc')}</p>
                <button
                  className="btn btn-primary"
                  onClick={() => setSubmitStatus('idle')}
                  style={{ marginTop: '16px' }}
                >
                  {t('cons.another')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="consultation-form" noValidate>
                <h2 id="form-title" className="form-title">{t('cons.form.title')}</h2>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">
                      {t('cons.name')} <span className="required" aria-hidden="true">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className={`form-input ${errors.name && touched.name ? 'error' : ''}`}
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="أحمد محمد علي"
                      autoComplete="name"
                      aria-invalid={errors.name && touched.name ? 'true' : 'false'}
                      aria-describedby={errors.name && touched.name ? 'name-error' : undefined}
                      disabled={isSubmitting}
                    />
                    {errors.name && touched.name && (
                      <span id="name-error" className="form-error" role="alert">
                        <AlertCircle size={14} aria-hidden="true" />
                        {errors.name}
                      </span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone" className="form-label">
                      {t('cons.phone')} <span className="required" aria-hidden="true">*</span>
                    </label>
                    <PhoneInput
                      id="phone"
                      name="phone"
                      international
                      defaultCountry="SA"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      onBlur={handlePhoneBlur}
                      className={`form-input phone-input ${errors.phone && touched.phone ? 'error' : ''}`}
                      placeholder={t('cons.phone.hint')}
                      disabled={isSubmitting}
                      aria-invalid={errors.phone && touched.phone ? 'true' : 'false'}
                      aria-describedby={errors.phone && touched.phone ? 'phone-error' : undefined}
                    />
                    <p className="form-hint">{t('cons.phone.hint')}</p>
                    {errors.phone && touched.phone && (
                      <span id="phone-error" className="form-error" role="alert">
                        <AlertCircle size={14} aria-hidden="true" />
                        {errors.phone}
                      </span>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">
                      {t('cons.email')} <span className="required" aria-hidden="true">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className={`form-input ${errors.email && touched.email ? 'error' : ''}`}
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="email@example.com"
                      autoComplete="email"
                      aria-invalid={errors.email && touched.email ? 'true' : 'false'}
                      aria-describedby={errors.email && touched.email ? 'email-error' : undefined}
                      disabled={isSubmitting}
                    />
                    {errors.email && touched.email && (
                      <span id="email-error" className="form-error" role="alert">
                        <AlertCircle size={14} aria-hidden="true" />
                        {errors.email}
                      </span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="projectType" className="form-label">
                      {t('cons.type')} <span className="required" aria-hidden="true">*</span>
                    </label>
                    <select
                      id="projectType"
                      name="projectType"
                      className={`form-input ${errors.projectType && touched.projectType ? 'error' : ''}`}
                      value={formData.projectType}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      aria-invalid={errors.projectType && touched.projectType ? 'true' : 'false'}
                      aria-describedby={errors.projectType && touched.projectType ? 'projectType-error' : undefined}
                      disabled={isSubmitting}
                    >
                      <option value="">{t('cons.type.placeholder')}</option>
                      {projectTypes.map((value) => (
                        <option key={value} value={value}>{t(projectTypeValue[value])}</option>
                      ))}
                    </select>
                    {errors.projectType && touched.projectType && (
                      <span id="projectType-error" className="form-error" role="alert">
                        <AlertCircle size={14} aria-hidden="true" />
                        {errors.projectType}
                      </span>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="details" className="form-label">
                    {t('cons.details')} <span className="required" aria-hidden="true">*</span>
                  </label>
                  <textarea
                    id="details"
                    name="details"
                    rows={5}
                    className={`form-input ${errors.details && touched.details ? 'error' : ''}`}
                    value={formData.details}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={t('cons.details.placeholder')}
                    aria-invalid={errors.details && touched.details ? 'true' : 'false'}
                    aria-describedby={errors.details && touched.details ? 'details-error' : undefined}
                    disabled={isSubmitting}
                  />
                  {errors.details && touched.details && (
                    <span id="details-error" className="form-error" role="alert">
                      <AlertCircle size={14} aria-hidden="true" />
                      {errors.details}
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={20} className="spinning" aria-hidden="true" />
                      {t('cons.submitting')}
                    </>
                  ) : (
                    t('cons.submit')
                  )}
                </button>

                <p className="form-note">
                  {t('cons.note')}
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  )
}