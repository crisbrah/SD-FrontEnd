import { useState, FormEvent } from 'react'
import { Navigate, Link, useNavigate } from 'react-router-dom'
import { Cross, Eye, EyeOff, LogIn, AlertCircle, Settings, CheckCircle } from 'lucide-react'
import { GoogleLogin } from '@react-oauth/google'
import { useAuth } from '../context/AuthContext'
import { authService } from '../lib/api'

export default function LoginPage() {
  const { login, loginWithGoogle, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError]       = useState<string | null>(null)
  const [loading, setLoading]   = useState(false)

  // Bootstrap
  const [showBootstrap, setShowBootstrap] = useState(false)
  const [bootstrapEmail, setBootstrapEmail] = useState('')
  const [bootstrapLoading, setBootstrapLoading] = useState(false)
  const [bootstrapMsg, setBootstrapMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  const handleBootstrap = async (e: FormEvent) => {
    e.preventDefault()
    setBootstrapLoading(true)
    setBootstrapMsg(null)
    try {
      await authService.bootstrap(bootstrapEmail)
      setBootstrapMsg({ type: 'ok', text: '¡Super admin configurado! Ya puedes iniciar sesión.' })
      setBootstrapEmail('')
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } }
      setBootstrapMsg({ type: 'err', text: axiosErr?.response?.data?.message ?? 'Error al configurar.' })
    } finally {
      setBootstrapLoading(false)
    }
  }

  if (isAuthenticated) return <Navigate to="/dashboard" replace />

  // ── Login con email/contraseña ────────────────────────────────────────────
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(email, password)
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status?: number; data?: { message?: string } } }
      const msg = axiosErr?.response?.data?.message ?? ''
      if (msg.toLowerCase().includes('pendiente')) {
        navigate('/pending')
      } else if (axiosErr?.response?.status === 401 || axiosErr?.response?.status === 403) {
        setError('Credenciales incorrectas o cuenta sin acceso.')
      } else {
        setError('Error al conectar con el servidor. Intenta más tarde.')
      }
    } finally {
      setLoading(false)
    }
  }

  // ── Login con Google ──────────────────────────────────────────────────────
  const handleGoogleSuccess = async (credentialResponse: { credential?: string }) => {
    if (!credentialResponse.credential) return
    setError(null)
    setLoading(true)
    try {
      const result = await loginWithGoogle(credentialResponse.credential)
      if (result.status === 'APPROVED') {
        navigate('/dashboard')
      } else if (result.status === 'PENDING') {
        navigate('/pending')
      } else if (result.status === 'NEW') {
        // Usuario nuevo con Google → completar perfil
        navigate('/register/google', {
          state: { email: result.email, nombres: result.nombres, idToken: credentialResponse.credential }
        })
      }
    } catch {
      setError('Error al autenticar con Google. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen hero-bg flex items-center justify-center px-4">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-primary-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Card */}
        <div className="glass rounded-3xl p-8 shadow-2xl border border-white/20">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 bg-gold-500 rounded-2xl flex items-center justify-center shadow-xl mb-4">
              <Cross className="w-7 h-7 text-dark-900" />
            </div>
            <h1 className="font-display text-2xl font-bold text-white">Sanidad Divina</h1>
            <p className="text-slate-400 text-sm mt-1">Sistema de Gestión</p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
              <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Google Sign-In */}
          <div className="flex justify-center mb-4">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Error al iniciar sesión con Google.')}
              theme="filled_black"
              shape="rectangular"
              size="large"
              text="signin_with"
            />
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-white/15" />
            <span className="text-slate-500 text-xs">o con correo</span>
            <div className="flex-1 h-px bg-white/15" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-1.5">
                Correo electrónico
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="correo@iglesia.com"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-500
                           focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-500
                             focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-primary-600 hover:bg-primary-500
                         text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg
                         hover:shadow-primary-500/30 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <LogIn className="w-4 h-4" />
              )}
              {loading ? 'Ingresando...' : 'Iniciar sesión'}
            </button>
          </form>

          {/* Footer links */}
          <div className="mt-6 flex flex-col items-center gap-2 text-sm">
            <p className="text-slate-400">
              ¿No tienes cuenta?{' '}
              <Link to="/register" className="text-gold-400 hover:text-gold-300 font-medium transition-colors">
                Solicitar acceso
              </Link>
            </p>
            <Link to="/" className="text-slate-500 hover:text-slate-300 transition-colors text-xs">
              ← Volver al inicio
            </Link>
          </div>

          {/* Bootstrap panel (primer inicio) */}
          <div className="mt-4 border-t border-white/10 pt-4">
            <button
              type="button"
              onClick={() => setShowBootstrap(v => !v)}
              className="w-full flex items-center justify-center gap-1.5 text-xs text-slate-600 hover:text-slate-400 transition-colors"
            >
              <Settings className="w-3 h-3" />
              Primer inicio / Configuración inicial
            </button>

            {showBootstrap && (
              <div className="mt-3 p-4 bg-white/5 rounded-xl border border-white/10">
                <p className="text-xs text-slate-400 mb-3">
                  ¿Ya tienes una cuenta registrada y quieres promoverla a Super Admin?
                  Ingresa tu email. Solo funciona cuando no hay ningún Super Admin configurado.
                </p>
                {bootstrapMsg && (
                  <div className={`flex items-start gap-2 rounded-lg px-3 py-2 mb-3 text-xs ${bootstrapMsg.type === 'ok' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300' : 'bg-red-500/10 border border-red-500/30 text-red-300'}`}>
                    {bootstrapMsg.type === 'ok' ? <CheckCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" /> : <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />}
                    {bootstrapMsg.text}
                  </div>
                )}
                <form onSubmit={handleBootstrap} className="flex gap-2">
                  <input
                    type="email"
                    required
                    value={bootstrapEmail}
                    onChange={e => setBootstrapEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-600 text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                  <button
                    type="submit"
                    disabled={bootstrapLoading}
                    className="px-3 py-2 bg-primary-700 hover:bg-primary-600 text-white rounded-lg text-xs transition-colors disabled:opacity-60"
                  >
                    {bootstrapLoading ? '...' : 'Promover'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
