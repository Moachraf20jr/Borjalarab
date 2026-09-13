import { useLanguage } from '../i18n/LanguageContext'
import PageHero from '../components/PageHero'
import ServiceCard from '../components/ServiceCard'
import {
  Building2,
  Layout,
  Lightbulb,
  FileText,
  Box,
  Ruler,
  ClipboardCheck,
  ShieldCheck,
  Eye,
  FileCheck,
  CalendarClock,
  Briefcase,
} from 'lucide-react'

const serviceIcons = [
  Ruler,
  Building2,
  Lightbulb,
  FileText,
  Box,
  Layout,
  ClipboardCheck,
  ShieldCheck,
  Eye,
  FileCheck,
  CalendarClock,
  Briefcase,
]

const serviceKeys = [
  'svc1', 'svc1d',
  'svc2', 'svc2d',
  'svc3', 'svc3d',
  'svc4', 'svc4d',
  'svc5', 'svc5d',
  'svc6', 'svc6d',
  'svc7', 'svc7d',
  'svc8', 'svc8d',
  'svc9', 'svc9d',
  'svc10', 'svc10d',
  'svc11', 'svc11d',
  'svc12', 'svc12d',
]

export default function Services() {
  const { t } = useLanguage()

  const services = serviceIcons.map((icon, index) => ({
    icon,
    title: t(serviceKeys[index * 2]),
    desc: t(serviceKeys[index * 2 + 1]),
  }))

  return (
    <>
      <PageHero
        label={t('services.hero.label')}
        title={t('services.hero.title')}
        description={t('services.hero.desc')}
      />
      <section className="section services-list-section" aria-labelledby="services-list-title">
        <div className="container">
          <div className="services-grid-3">
            {services.map((service, index) => (
              <ServiceCard
                key={index}
                icon={service.icon}
                title={service.title}
                description={service.desc}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}