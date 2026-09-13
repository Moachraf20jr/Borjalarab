import { useState, useEffect } from 'react'
import { userAPI } from '../../services/api'
import { useLanguage } from '../../i18n/LanguageContext'
import { Plus, Search, Edit, Trash2, Loader2, ChevronLeft, ChevronRight, X, Shield, User, UserMinus } from 'lucide-react'
import Loading from '../../components/Loading'
import ErrorMessage from '../../components/ErrorMessage'
import { useToast } from '../../hooks/useToast'
import { useAuth } from '../../context/AuthContext'

export default function AdminUsers() {
  const { t, lang } = useLanguage()
  const { success, error: toastError } = useToast()
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 })
  const [filters, setFilters] = useState({ search: '', role: '', isActive: '' })
  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'editor',
    isActive: true
  })
  const [submitting, setSubmitting] = useState(false)

  const roleOptions = [
    { value: 'admin', label: t('admin.role.admin') },
    { value: 'manager', label: t('admin.role.manager') },
    { value: 'editor', label: t('admin.role.editor') }
  ]

  const statusOptions = [
    { value: '', label: t('admin.filter.allStatuses') },
    { value: 'true', label: t('admin.active') },
    { value: 'false', label: t('admin.disabled') }
  ]

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const params = { page: pagination.page, limit: pagination.limit, ...filters }
      const response = await userAPI.getAll(params)
      setUsers(response.data.data || [])
      setPagination(prev => ({ ...prev, ...response.data.pagination }))
      setError(null)
    } catch (err) {
      setError(err.response?.data?.message || t('admin.users.loadFailed'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, filters])

  const handleSearch = (e) => {
    setFilters(prev => ({ ...prev, search: e.target.value }))
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'editor',
      isActive: true
    })
    setEditingUser(null)
  }

  const openForm = (user = null) => {
    if (user) {
      setEditingUser(user)
      setFormData({
        name: user.name,
        email: user.email,
        password: '',
        role: user.role,
        isActive: user.isActive
      })
    } else {
      resetForm()
    }
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const data = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        isActive: formData.isActive
      }

      if (formData.password) {
        data.password = formData.password
      }

      if (editingUser) {
        await userAPI.update(editingUser._id, data)
        success(t('admin.users.updated'))
      } else {
        await userAPI.create(data)
        success(t('admin.users.created'))
      }
      setShowForm(false)
      resetForm()
      fetchUsers()
    } catch (err) {
      toastError(err.response?.data?.message || t('admin.users.saveFailed'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (id === currentUser.id) {
      toastError(t('admin.users.cannotDeleteSelf'))
      return
    }
    if (!window.confirm(t('admin.confirm.user'))) return
    try {
      await userAPI.delete(id)
      success(t('admin.users.deleted'))
      fetchUsers()
    } catch (err) {
      toastError(err.response?.data?.message || t('admin.users.deleteFailed'))
    }
  }

  const handleToggleActive = async (id, currentStatus) => {
    if (id === currentUser.id) {
      toastError(t('admin.users.cannotDisableSelf'))
      return
    }
    try {
      await userAPI.update(id, { isActive: !currentStatus })
      success(currentStatus ? t('admin.users.disabled') : t('admin.users.enabled'))
      fetchUsers()
    } catch (err) {
      toastError(err.response?.data?.message || t('admin.users.toggleFailed'))
    }
  }

  if (loading && users.length === 0) {
    return <Loading message={t('admin.loading.users')} />
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchUsers} />
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">{t('admin.users.title')}</h1>
          <p className="text-text-muted mt-1">{t('admin.users.subtitle')}</p>
        </div>
        <button onClick={() => openForm()} className="btn btn-primary">
          <Plus size={18} aria-hidden="true" />
          {t('admin.add.user')}
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} aria-hidden="true" />
            <input
              type="text"
              placeholder={t('admin.search.users')}
              value={filters.search}
              onChange={handleSearch}
              className="w-full pr-10 pl-4 py-2.5 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <select
              value={filters.role}
              onChange={(e) => handleFilterChange('role', e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
            >
              <option value="">{t('admin.filter.allRoles')}</option>
              {roleOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            <select
              value={filters.isActive}
              onChange={(e) => handleFilterChange('isActive', e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
            >
              {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full" role="table">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-right font-semibold text-text-muted">{t('admin.col.name')}</th>
                <th className="px-4 py-3 text-right font-semibold text-text-muted">{t('admin.col.email')}</th>
                <th className="px-4 py-3 text-right font-semibold text-text-muted hidden md:table-cell">{t('admin.col.role')}</th>
                <th className="px-4 py-3 text-right font-semibold text-text-muted">{t('admin.col.status')}</th>
                <th className="px-4 py-3 text-right font-semibold text-text-muted hidden lg:table-cell">{t('admin.col.created')}</th>
                <th className="px-4 py-3 text-left font-semibold text-text-muted">{t('admin.col.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-text-muted">
                    {t('admin.empty.users')}
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                          <User size={18} className="text-gold" aria-hidden="true" />
                        </div>
                        <div>
                          <p className="font-medium text-navy">{user.name}</p>
                          {user._id === currentUser.id && (
                            <span className="text-xs text-gold">{t('admin.users.you')}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-text-muted">{user.email}</td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <select
                        value={user.role}
                        onChange={(e) => userAPI.update(user._id, { role: e.target.value }).then(() => {
                          success(t('admin.users.roleUpdated'))
                          fetchUsers()
                        }).catch(() => toastError(t('admin.users.roleUpdateFailed')))}
                        disabled={user._id === currentUser.id}
                        className="px-2 py-1 rounded-full text-xs font-medium bg-gold/10 text-gold border-0 focus:ring-2 focus:ring-gold/50 outline-none cursor-pointer"
                      >
                        {roleOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-4">
                      <select
                        value={user.isActive.toString()}
                        onChange={(e) => handleToggleActive(user._id, e.target.value === 'true')}
                        disabled={user._id === currentUser.id}
                        className={`px-2 py-1 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-gold/50 outline-none cursor-pointer ${
                          user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}
                      >
                        <option value="true">{t('admin.active')}</option>
                        <option value="false">{t('admin.disabled')}</option>
                      </select>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell text-text-muted">
                      {new Date(user.createdAt).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-GB')}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openForm(user)}
                          className="p-2 text-text-muted hover:text-gold hover:bg-gold/10 rounded-lg transition-colors"
                          aria-label={t('admin.aria.edit')}
                        >
                          <Edit size={18} aria-hidden="true" />
                        </button>
                        {user._id !== currentUser.id && (
                          <button
                            onClick={() => handleDelete(user._id)}
                            className="p-2 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            aria-label={t('admin.aria.delete')}
                          >
                            <Trash2 size={18} aria-hidden="true" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {pagination.pages > 1 && (
          <div className="px-4 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-text-muted">
              {t('admin.pagination.showing', {
                from: ((pagination.page - 1) * pagination.limit) + 1,
                to: Math.min(pagination.page * pagination.limit, pagination.total),
                total: pagination.total
              })}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={t('admin.aria.prev')}
              >
                <ChevronRight size={18} aria-hidden="true" />
              </button>
              <span className="px-3 text-sm font-medium text-navy">
                {t('admin.pagination.pageOf', { page: pagination.page, pages: pagination.pages })}
              </span>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page === pagination.pages}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={t('admin.aria.next')}
              >
                <ChevronLeft size={18} aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-navy">{editingUser ? t('admin.modal.editUser') : t('admin.modal.addUser')}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 text-text-muted hover:text-navy rounded-lg hover:bg-gray-100" aria-label={t('admin.aria.close')}>
                <X size={24} aria-hidden="true" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5" noValidate>
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-navy mb-2">{t('admin.field.userName')} <span className="text-gold">*</span></label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
                  required
                  placeholder={t('admin.placeholder.userName')}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-navy mb-2">{t('admin.col.email')} <span className="text-gold">*</span></label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
                  required
                  placeholder="admin@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-navy mb-2">
                  {t('admin.field.password')} {editingUser ? t('admin.field.passwordHint') : <span className="text-gold">*</span>}
                </label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
                  required={!editingUser}
                  placeholder="••••••••"
                  autoComplete={editingUser ? 'off' : 'new-password'}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="role" className="block text-sm font-semibold text-navy mb-2">{t('admin.field.role')} <span className="text-gold">*</span></label>
                  <select
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
                    required
                  >
                    {roleOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>

                <div className="flex items-center">
                  <div className="flex items-center gap-2 w-full">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="w-4 h-4 text-gold border-gray-300 rounded focus:ring-gold"
                    />
                    <label htmlFor="isActive" className="text-sm font-medium text-navy cursor-pointer">{t('admin.active')}</label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setShowForm(false)} className="btn btn-outline">{t('admin.button.cancel')}</button>
                <button type="submit" disabled={submitting} className="btn btn-primary">
                  {submitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                      {t('admin.button.saving')}
                    </>
                  ) : (
                    editingUser ? t('admin.button.updateUser') : t('admin.button.addUser')
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}