import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { projectAPI, resolveImageUrl } from '../services/api'
import { ArrowRight, MapPin, Calendar, Wrench, ChevronLeft } from 'lucide-react'
import { useLanguage, localized, localizedList, localizedCategory, formatLocalizedDate } from '../i18n/LanguageContext'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import EmptyState from '../components/EmptyState'

export default function ProjectDetails() {
  const { slug } = useParams()
  const { lang, t } = useLanguage()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true)
        const response = await projectAPI.getBySlug(slug)
        setProject(response.data.data)
        setError(null)
      } catch (err) {
        setError(err.response?.data?.message || t('projects.notfound'))
      } finally {
        setLoading(false)
      }
    }
    fetchProject()
  }, [slug])

  if (loading) {
    return <Loading message={t('projects.loadingDetail')} />
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <ErrorMessage message={error} onRetry={() => window.location.reload()} />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <EmptyState type="projects" message={t('projects.notfound')} />
      </div>
    )
  }

  const title = localized(project, 'title', lang)
  const description = localized(project, 'description', lang)
  const fullDescription = localized(project, 'fullDescription', lang)
  const services = localizedList(project, 'services', lang)
  const category = localizedCategory(project, lang, t)

  return (
    <>
      <section className="page-hero" style={{ backgroundImage: project.image ? `url(${resolveImageUrl(project.image)})` : 'none' }} aria-labelledby="project-title">
        <div className="absolute inset-0 bg-navy/85" aria-hidden="true" />
        <div className="container relative page-hero-content">
          <span className="section-label">{category}</span>
          <h1 id="project-title" className="page-hero-title">{title}</h1>
          <p className="page-hero-desc">{description}</p>
        </div>
      </section>

      <section className="section" aria-labelledby="details-title">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {project.image && (
                <div className="rounded-xl overflow-hidden shadow-lg">
                  <img src={resolveImageUrl(project.image)} alt={title} className="w-full h-auto" loading="eager" />
                </div>
              )}

              <div>
                <h2 id="details-title" className="text-2xl font-bold text-navy mb-4">{t('projects.detailsTitle')}</h2>
                <div className="prose prose-rtl max-w-none text-text-muted leading-relaxed">
                  {fullDescription ? (
                    fullDescription.split('\n').map((paragraph, i) => (
                      <p key={i} className="mb-4">{paragraph}</p>
                    ))
                  ) : (
                    <p className="mb-4">{description}</p>
                  )}
                </div>
              </div>

              {services.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-navy mb-4">{t('projects.services')}</h3>
                  <div className="flex flex-wrap gap-3">
                    {services.map((service, index) => (
                      <span key={index} className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-navy">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-100 p-6 sticky top-24">
                <h3 className="text-lg font-bold text-navy mb-4">{t('projects.infoTitle')}</h3>
                <dl className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="text-gold mt-1 flex-shrink-0" size={20} aria-hidden="true" />
                    <div>
                      <dt className="text-sm font-medium text-text-muted">{t('projects.location')}</dt>
                      <dd className="text-navy">{localized(project, 'location', lang) || t('projects.location.na')}</dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="text-gold mt-1 flex-shrink-0" size={20} aria-hidden="true" />
                    <div>
                      <dt className="text-sm font-medium text-text-muted">{t('projects.year')}</dt>
                      <dd className="text-navy">{project.year}</dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Wrench className="text-gold mt-1 flex-shrink-0" size={20} aria-hidden="true" />
                    <div>
                      <dt className="text-sm font-medium text-text-muted">{t('projects.category')}</dt>
                      <dd className="text-navy">{category}</dd>
                    </div>
                  </div>
                </dl>

                {project.featured && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-gold/10 text-gold rounded-full text-sm font-medium">
                      <span className="w-2 h-2 bg-gold rounded-full" aria-hidden="true" />
                      {t('projects.featured')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-100">
            <Link to="/projects" className="text-link inline-flex items-center gap-2">
              <ChevronLeft size={20} aria-hidden="true" />
              {t('projects.back')}
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}