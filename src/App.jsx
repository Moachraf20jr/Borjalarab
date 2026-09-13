import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { useEffect, Suspense } from 'react'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import { LanguageProvider, useLanguage } from './i18n/LanguageContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Services from './pages/Services'
import Projects from './pages/Projects'
import ProjectDetails from './pages/ProjectDetails'
import About from './pages/About'
import Articles from './pages/Articles'
import ArticleDetails from './pages/ArticleDetails'
import Consultation from './pages/Consultation'
import NotFound from './pages/NotFound'
import AdminLogin from './pages/admin/AdminLogin'
import AdminLayout from './components/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminConsultations from './pages/admin/AdminConsultations'
import AdminProjects from './pages/admin/AdminProjects'
import AdminArticles from './pages/admin/AdminArticles'
import AdminTeam from './pages/admin/AdminTeam'
import AdminUsers from './pages/admin/AdminUsers'
import ProtectedRoute from './components/ProtectedRoute'
import ToastContainer from './components/ToastContainer'
import Loading from './components/Loading'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function AdminRoutes() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'manager', 'editor']}>
      <AdminLayout />
    </ProtectedRoute>
  )
}

const adminChildren = (
  <>
    <Route index element={<Navigate to="dashboard" replace />} />
    <Route path="dashboard" element={<AdminDashboard />} />
    <Route path="consultations" element={<AdminConsultations />} />
    <Route path="projects" element={<AdminProjects />} />
    <Route path="articles" element={<AdminArticles />} />
    <Route path="team" element={<AdminTeam />} />
    <Route path="users" element={<AdminUsers />} />
  </>
)

function PublicRoutes() {
  const { t } = useLanguage()
  return (
    <>
      <Navbar />
      <main id="main-content" role="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<Suspense fallback={<Loading message={t('projects.loadingDetail')} />}> <ProjectDetails /> </Suspense>} />
          <Route path="/about" element={<About />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/articles/:slug" element={<Suspense fallback={<Loading message={t('articles.loadingDetail')} />}> <ArticleDetails /> </Suspense>} />
          <Route path="/consultation" element={<Consultation />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ToastProvider>
          <div className="app">
            <ScrollToTop />
            <Routes>
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/*" element={<AdminRoutes />}>
                {adminChildren}
              </Route>
              <Route path="/*" element={<PublicRoutes />} />
            </Routes>
            <ToastContainer />
          </div>
        </ToastProvider>
      </AuthProvider>
    </LanguageProvider>
  )
}

export default App