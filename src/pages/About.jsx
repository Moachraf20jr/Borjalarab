import { useEffect, useState } from 'react'
import { useLanguage, localized } from '../i18n/LanguageContext'
import { teamAPI, resolveImageUrl } from '../services/api'
import { Target, Eye, Heart, Users } from 'lucide-react'
import PageHero from '../components/PageHero'
import ServiceCard from '../components/ServiceCard'

const valueData = [
  { key: 'about.value1', descKey: 'about.value1d', icon: Target },
  { key: 'about.value2', descKey: 'about.value2d', icon: Eye },
  { key: 'about.value3', descKey: 'about.value3d', icon: Heart },
]

const statData = [
  { value: '+10', key: 'about.stat1' },
  { value: '+150', key: 'about.stat2' },
  { value: '+20', key: 'about.stat3' },
  { value: '+95%', key: 'about.stat4' },
]

export default function About() {
  const { lang, t } = useLanguage()
  const [team, setTeam] = useState([])
  const [teamLoading, setTeamLoading] = useState(true)
  const [teamError, setTeamError] = useState(null)

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        setTeamLoading(true)
        const response = await teamAPI.getPublic()
        setTeam(response.data.data || [])
        setTeamError(null)
      } catch (err) {
        setTeamError(err.response?.data?.message || t('about.team.error'))
        setTeam([])
      } finally {
        setTeamLoading(false)
      }
    }
    fetchTeam()
  }, [])

  return (
    <>
      <PageHero
        label={t('about.hero.label')}
        title={t('about.hero.title')}
        description={t('about.hero.desc')}
      />
      <section className="section about-intro" aria-labelledby="about-intro-title">
        <div className="container">
          <div className="about-grid">
            <div className="about-content">
              <span className="section-label">{t('about.intro.label')}</span>
              <h2 id="about-intro-title" className="section-title" style={{ textAlign: 'right', maxWidth: 'none' }}>
                {t('about.intro.title')}
              </h2>
              <p className="about-desc">{t('about.intro.p1')}</p>
              <p className="about-desc">{t('about.intro.p2')}</p>
            </div>
            <div className="about-visual" aria-hidden="true">
              <div className="about-shape"></div>
            </div>
          </div>
        </div>
      </section>

      <section className="section values-section" aria-labelledby="values-title">
        <div className="container">
          <div className="section-header">
            <h2 id="values-title" className="section-title">{t('about.values.title')}</h2>
          </div>
          <div className="values-grid">
            {valueData.map((value, index) => (
              <ServiceCard
                key={index}
                icon={value.icon}
                title={t(value.key)}
                description={t(value.descKey)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section stats-section" aria-labelledby="stats-title">
        <div className="container">
          <div className="stats-grid">
            {statData.map((stat, index) => (
              <div key={index} className="stat-item">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{t(stat.key)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section team-section" aria-labelledby="team-title">
        <div className="container">
          <div className="section-header">
            <h2 id="team-title" className="section-title">{t('about.team.title')}</h2>
          </div>
          {teamLoading ? (
            <div className="team-grid" role="status" aria-live="polite">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="team-card animate-pulse">
                  <div className="team-image">
                    <div className="w-full h-full bg-gray-200 animate-pulse" />
                  </div>
                  <div className="team-info">
                    <div className="h-5 bg-gray-200 rounded w-2/3 mx-auto animate-pulse mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : teamError ? (
            <div className="text-center py-12 text-text-muted">{t('about.team.error')}</div>
          ) : team.length === 0 ? (
            <div className="text-center py-12 text-text-muted">{t('about.team.empty')}</div>
          ) : (
            <div className="team-grid">
              {team.map((member) => (
                <div key={member._id} className="team-card">
                  <div className="team-image">
                    {member.image ? (
                      <img src={resolveImageUrl(member.image)} alt={localized(member, 'name', lang)} loading="lazy" />
                    ) : (
                      <div className="team-image-placeholder" aria-hidden="true">
                        <Users size={48} />
                      </div>
                    )}
                  </div>
                  <div className="team-info">
                    <h3 className="team-name">{localized(member, 'name', lang)}</h3>
                    <p className="team-role">{localized(member, 'role', lang)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}