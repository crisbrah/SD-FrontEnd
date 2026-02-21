import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import PendingApprovalPage from './pages/PendingApprovalPage'
import CompleteGoogleProfilePage from './pages/CompleteGoogleProfilePage'
import DashboardPage from './pages/DashboardPage'
import ProtectedRoute from './components/layout/ProtectedRoute'
import WhatsAppButton from './components/ui/WhatsAppButton'
import Chatbot from './components/ui/Chatbot'
import BackendBanner from './components/ui/BackendBanner'

export default function App() {
  const { isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Routes>
        <Route path="/"               element={<LandingPage />} />
        <Route path="/login"          element={<LoginPage />} />
        <Route path="/register"       element={<RegisterPage />} />
        <Route path="/register/google" element={<CompleteGoogleProfilePage />} />
        <Route path="/pending"        element={<PendingApprovalPage />} />
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Backend connectivity banner */}
      <BackendBanner />
      {/* Global floating widgets */}
      <WhatsAppButton phone="51999999999" message="¡Hola! Quisiera más información sobre Iglesia Sanidad Divina." />
      <Chatbot />
    </>
  )
}
