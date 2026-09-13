import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Loading from './Loading'

export default function ProtectedRoute({ children, allowedRoles = ['admin', 'manager', 'editor'] }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <Loading message="جاري التحقق من الصلاحيات..." />
  }

  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/admin/dashboard" replace />
  }

  return children
}