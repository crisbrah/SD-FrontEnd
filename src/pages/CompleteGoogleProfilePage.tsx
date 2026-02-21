import { useState, FormEvent } from 'react'
import { Link, useLocation, useNavigate, Navigate } from 'react-router-dom'
import { Cross, AlertCircle, UserPlus } from 'lucide-react'
import { authService } from '../lib/api'

interface LocationState {
  email?: string
  nombres?: string
  idToken?: string
}

export default function CompleteGoogleProfilePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = (location.state ?? {}) as LocationState

  // Si no hay idToken en el state, no debería estar aquí
  if (!state.idToken) return <Navigate to="/login" replace />

  const [form, setForm] = useState({
    nombres: state.nombres ?? '',
    apePat: '',
    apeMat: '',
    dni: '',
    fechaNacimiento: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (form.dni.length !== 8) {
      setError('El DNI debe tener exactamente 8 dígitos.')
      return
    }

    setLoading(true)
    try {
      await authService.googleSignUp({
        idToken: state.idToken!,
        email: state.email!,
        nombres: form.nombres,
        apePat: form.apePat,
        apeMat: form.apeMat,
        dni: form.dni,
        fechaNacimiento: form.fechaNacimiento,
      })
      navigate('/pending')
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string; data?: Record<string, string> } } }
      const data = axiosErr?.response?.data
      if (data?.data && typeof data.data === 'object') {
        const firstMsg = Object.values(data.data)[0]
        setError(firstMsg ?? 'Error al registrarse.')
      } else {
        setError(data?.message ?? 'Error al conectar con el servidor.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen hero-bg flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        <div className="glass rounded-3xl p-8 shadow-2xl border border-white/20">
          {/* Header */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-14 h-14 bg-gold-500 rounded-2xl flex items-center justify-center shadow-xl mb-4">
              <Cross className="w-7 h-7 text-dark-900" />
            </div>
            <h1 className="font-display text-2xl font-bold text-white">Completa tu perfil</h1>
            <p className="text-slate-400 text-sm mt-1 text-center max-w-xs">
              Ingresaste con Google como{' '}
              <span className="text-gold-400 font-medium">{state.email}</span>.
              Necesitamos algunos datos adicionales.
            </p>
          </div>

          {error && (
            <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
              <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nombres */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-1.5">Nombres</label>
              <input
                name="nombres" type="text" required
                value={form.nombres} onChange={handleChange}
                placeholder="Juan Pablo"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-500
                           focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Apellidos */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-1.5">Apellido paterno</label>
                <input
                  name="apePat" type="text" required
                  value={form.apePat} onChange={handleChange}
                  placeholder="García"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-500
                             focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-1.5">Apellido materno</label>
                <input
                  name="apeMat" type="text" required
                  value={form.apeMat} onChange={handleChange}
                  placeholder="López"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-500
                             focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* DNI y fecha */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-1.5">DNI</label>
                <input
                  name="dni" type="text" required maxLength={8}
                  value={form.dni} onChange={handleChange}
                  placeholder="12345678"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-500
                             focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-1.5">Fecha de nacimiento</label>
                <input
                  name="fechaNacimiento" type="date" required
                  value={form.fechaNacimiento} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-500
                             focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all
                             [color-scheme:dark]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gold-500 hover:bg-gold-400
                         text-dark-900 font-semibold rounded-xl transition-all duration-200 hover:shadow-lg
                         hover:shadow-gold-500/30 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-dark-900 border-t-transparent rounded-full animate-spin" />
              ) : (
                <UserPlus className="w-4 h-4" />
              )}
              {loading ? 'Enviando...' : 'Enviar solicitud de acceso'}
            </button>
          </form>

          <div className="mt-5 text-center">
            <Link to="/login" className="text-slate-500 hover:text-slate-300 transition-colors text-xs">
              ← Volver al login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
