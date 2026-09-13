import { useState, useEffect } from 'react'
import { consultationAPI, projectAPI, articleAPI, teamAPI } from '../../services/api'
import { useLanguage, formatLocalizedDate } from '../../i18n/LanguageContext'
import { projectTypeValue } from '../../i18n/translations'
import { TrendingUp, Inbox, FolderKanban, FileText, Clock, CheckCircle, AlertTriangle, XCircle, Users } from 'lucide-react'
import Loading from '../../components/Loading'
import ErrorMessage from '../../components/ErrorMessage'

const statusConfig = {
  new: { key: 'admin.status.new', icon: Inbox, color: 'bg-blue-100 text-blue-700', iconColor: 'text-blue-500' },
  contacted: { key: 'admin.status.contacted', icon: CheckCircle, color: 'bg-yellow-100 text-yellow-700', iconColor: 'text-yellow-500' },
  in_progress: { key: 'admin.status.inProgress', icon: TrendingUp, color: 'bg-purple-100 text-purple-700', iconColor: 'text-purple-500' },
  completed: { key: 'admin.status.completed', icon: CheckCircle, color: 'bg-green-100 text-green-700', iconColor: 'text-green-500' },
  cancelled: { key: 'admin.status.cancelled', icon: XCircle, color: 'bg-red-100 text-red-700', iconColor: 'text-red-500' }
}

export default function AdminDashboard() {
  const { t, lang } = useLanguage()
  const [stats, setStats] = useState({
    totalConsultations: 0,
    newConsultations: 0,
    inProgressConsultations: 0,
    completedConsultations: 0,
    totalProjects: 0,
    publishedProjects: 0,
    totalArticles: 0,
    publishedArticles: 0,
    totalTeam: 0,
    activeTeam: 0
  })
  const [recentConsultations, setRecentConsultations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchStats = async () => {
    try {
      setLoading(true)
      const [consultationsRes, projectsRes, articlesRes, teamRes] = await Promise.all([
        consultationAPI.getAll({ limit: 100 }),
        projectAPI.getAll({ limit: 100 }),
        articleAPI.getAll({ limit: 100 }),
        teamAPI.getAll({ limit: 100 })
      ])

      const consultations = consultationsRes.data.data || []
      const projects = projectsRes.data.data || []
      const articles = articlesRes.data.data || []
      const teamMembers = teamRes.data.data || []

      const newCount = consultations.filter(c => c.status === 'new').length
      const inProgressCount = consultations.filter(c => c.status === 'in_progress').length
      const completedCount = consultations.filter(c => c.status === 'completed').length
      const publishedProjectsCount = projects.filter(p => p.isPublished).length
      const publishedArticlesCount = articles.filter(a => a.isPublished).length
      const activeTeamCount = teamMembers.filter(m => m.isActive !== false).length

      setStats({
        totalConsultations: consultations.length,
        newConsultations: newCount,
        inProgressConsultations: inProgressCount,
        completedConsultations: completedCount,
        totalProjects: projects.length,
        publishedProjects: publishedProjectsCount,
        totalArticles: articles.length,
        publishedArticles: publishedArticlesCount,
        totalTeam: teamMembers.length,
        activeTeam: activeTeamCount
      })

      setRecentConsultations(consultations.slice(0, 5))
      setError(null)
    } catch (err) {
      setError(err.response?.data?.message || t('admin.dashboard.loadFailed'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const statCards = [
    {
      label: t('admin.stat.totalConsultations'),
      value: stats.totalConsultations,
      icon: Inbox,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      trend: t('admin.trend.totalConsultations'),
      trendColor: 'text-blue-600'
    },
    {
      label: t('admin.stat.newConsultations'),
      value: stats.newConsultations,
      icon: Inbox,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      trend: t('admin.trend.new'),
      trendColor: 'text-yellow-600'
    },
    {
      label: t('admin.stat.inProgressConsultations'),
      value: stats.inProgressConsultations,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      trend: t('admin.trend.inProgress'),
      trendColor: 'text-purple-600'
    },
    {
      label: t('admin.stat.completedConsultations'),
      value: stats.completedConsultations,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      trend: t('admin.trend.completed'),
      trendColor: 'text-green-600'
    },
    {
      label: t('admin.stat.totalProjects'),
      value: stats.totalProjects,
      icon: FolderKanban,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      trend: t('admin.trend.published', { count: stats.publishedProjects }),
      trendColor: 'text-green-600'
    },
    {
      label: t('admin.stat.totalArticles'),
      value: stats.totalArticles,
      icon: FileText,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      trend: t('admin.trend.published', { count: stats.publishedArticles }),
      trendColor: 'text-orange-600'
    },
    {
      label: t('admin.stat.teamMembers'),
      value: stats.activeTeam,
      icon: Users,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      trend: t('admin.trend.team', { count: stats.totalTeam }),
      trendColor: 'text-teal-600'
    }
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 border border-gray-100 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
              <div className="h-10 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4" />
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchStats} />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">{t('admin.dashboard.title')}</h1>
          <p className="text-text-muted mt-1">{t('admin.dashboard.subtitle')}</p>
        </div>
        <button onClick={fetchStats} className="btn btn-outline">
          {t('admin.dashboard.refresh')}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 border border-gray-100 hover:border-gold/50 hover:shadow-lg transition-all">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-text-muted">{stat.label}</p>
                <p className="text-3xl font-bold text-navy mt-1">{stat.value}</p>
                <p className={`text-sm font-medium mt-2 ${stat.trendColor}`}>{stat.trend}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bgColor}`}>
                <stat.icon size={24} className={stat.color} aria-hidden="true" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-navy">{t('admin.dashboard.recent')}</h2>
          <a href="/admin/consultations" className="text-sm text-gold hover:underline">{t('admin.dashboard.viewAll')}</a>
        </div>
        <div className="divide-y divide-gray-100">
          {recentConsultations.length === 0 ? (
            <div className="p-12 text-center text-text-muted">
              {t('admin.dashboard.empty')}
            </div>
          ) : (
            recentConsultations.map((consultation) => {
              const status = statusConfig[consultation.status] || statusConfig.new
              const StatusIcon = status.icon
              const typeKey = projectTypeValue[consultation.projectType]
              const typeLabel = typeKey ? t(typeKey) : consultation.projectType
              return (
                <div key={consultation._id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-semibold text-navy truncate">{consultation.name}</h3>
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                          <StatusIcon size={12} className={status.iconColor} aria-hidden="true" />
                          {t(status.key)}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-text-muted">
                        <span>{consultation.phone}</span>
                        <span>{consultation.email}</span>
                        <span>{typeLabel}</span>
                      </div>
                      <p className="mt-2 text-sm text-text-muted line-clamp-1">{consultation.details}</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-text-muted">
                      <Clock size={16} aria-hidden="true" />
                      <span>{formatLocalizedDate(consultation.createdAt, lang)}</span>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}