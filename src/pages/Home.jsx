import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { projectAPI } from '../services/api'
import { Building2, ClipboardCheck, Users, ChevronRight } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'
import heroBg from '../assets/images/7-hero.jpg'
import introImg from '../assets/images/3-intro.jpg'
import PageHero from '../components/PageHero'
import ServiceCard from '../components/ServiceCard'
import ProjectCard from '../components/ProjectCard'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'

const featuredServiceData = [
  { key: 'fsvc1', descKey: 'fsvc1d', Icon: Building2 },
  { key: 'fsvc2', descKey: 'fsvc2d', Icon: ClipboardCheck },
  { key: 'fsvc3', descKey: 'fsvc3d', Icon: Users },
]

const processStepData = [
  { key: 'step1', descKey: 'step1d' },
  { key: 'step2', descKey: 'step2d' },
  { key: 'step3', descKey: 'step3d' },
  { key: 'step4', descKey: 'step4d' },
  { key: 'step5', descKey: 'step5d' },
]

export default function Home() {
  const { t } = useLanguage()
  const [featuredProjects, setFeaturedProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchFeaturedProjects = async () => {
      try {
        setLoading(true)
        const response = await projectAPI.getPublic({ featured: true, limit: 3 })
        setFeaturedProjects(response.data.data || [])
        setError(null)
      } catch (err) {
        setError(err.response?.data?.message)
        setFeaturedProjects([])
      } finally {
        setLoading(false)
      }
    }
    fetchFeaturedProjects()
  }, [])

  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-bg" aria-hidden="true">
          <img src={heroBg} alt="" />
        </div>
        <div className="container hero-content">
          <div className="hero-text">
            <span className="hero-label">{t('hero.label')}</span>
            <h1 id="hero-title" className="hero-title">
              {t('hero.title1')}<br />{t('hero.title2')}
            </h1>
            <p className="hero-desc">
              {t('hero.desc')}
            </p>
            <div className="hero-actions">
              <Link to="/consultation" className="btn btn-gold-outline btn-lg">
                {t('hero.contact')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section intro-section" aria-labelledby="intro-title">
        <div className="container">
          <div className="intro-grid">
            <div className="intro-content">
              <span className="section-label">{t('section.method')}</span>
              <h2 id="intro-title" className="section-title intro-title">
                {t('intro.title')}
              </h2>
              <p className="intro-desc">
                {t('intro.desc')}
              </p>
              <div className="intro-highlight">
                <span className="badge">{t('intro.badge')}</span>
              </div>
              <Link to="/about" className="text-link">
                {t('intro.link')}
                <ChevronRight size={18} aria-hidden="true" />
              </Link>
            </div>
            <div className="intro-visual" aria-hidden="true">
              <img src={introImg} alt="" />
            </div>
          </div>
        </div>
      </section>

      <section className="section services-section" aria-labelledby="services-title">
        <div className="container">
          <div className="section-header">
            <span className="section-label">{t('home.services.label')}</span>
            <h2 id="services-title" className="section-title">
              {t('home.services.title')}
            </h2>
          </div>
          <div className="services-grid">
            {featuredServiceData.map((svc, index) => (
              <ServiceCard
                key={index}
                number={`0${index + 1}`}
                title={t(svc.key)}
                description={t(svc.descKey)}
                featured
                icon={svc.Icon}
              />
            ))}
          </div>
          <div className="section-cta" style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link to="/services" className="text-link">
              {t('home.services.all')}
              <ChevronRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="section process-section" aria-labelledby="process-title">
        <div className="container">
          <div className="section-header">
            <span className="section-label">{t('home.process.label')}</span>
            <h2 id="process-title" className="section-title" style={{ color: '#FFFFFF' }}>
              {t('home.process.title')}
            </h2>
          </div>
          <div className="process-track">
            {processStepData.map((step, index) => (
              <div key={index} className="process-step">
                <span className="process-number">{index + 1}</span>
                <h3 className="process-step-title">{t(step.key)}</h3>
                <p className="process-step-desc">{t(step.descKey)}</p>
                {index < processStepData.length - 1 && (
                  <span className="process-separator" aria-hidden="true" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="featured-projects-title">
        <div className="container">
          <div className="section-header">
            <span className="section-label">{t('home.featured.label')}</span>
            <h2 id="featured-projects-title" className="section-title">
              {t('home.featured.title')}
            </h2>
          </div>
          {loading ? (
            <div className="projects-grid" role="status" aria-live="polite">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="project-card animate-pulse">
                  <div className="project-image">
                    <div className="w-full h-full bg-gray-200 animate-pulse" />
                  </div>
                  <div className="project-content">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-3 animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-full animate-pulse mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <ErrorMessage message={error} onRetry={() => window.location.reload()} />
          ) : featuredProjects.length === 0 ? (
            <div className="text-center py-12 text-text-muted">
              {t('home.featured.none')}
            </div>
          ) : (
            <div className="projects-grid">
              {featuredProjects.map((project, index) => (
                <ProjectCard key={project._id || index} {...project} />
              ))}
            </div>
          )}
          <div className="section-cta" style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link to="/projects" className="text-link">
              {t('home.featured.all')}
              <ChevronRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="section cta-section" aria-labelledby="cta-title">
        <div className="container">
          <div className="cta-card">
            <h2 id="cta-title" className="cta-title">
              {t('home.cta.title')}
            </h2>
            <p className="cta-desc">
              {t('home.cta.desc')}
            </p>
          </div>
        </div>
      </section>
    </>
  )
}