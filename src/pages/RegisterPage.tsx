import { useState, FormEvent, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Cross, AlertCircle, UserPlus, Search, CheckCircle, Loader2 } from 'lucide-react'
import { authService } from '../lib/api'

type ReniecData = { nombres: string; apellidoPaterno: string; apellidoMaterno: string }

export default function RegisterPage() {
  const navigate = useNavigate()

  // Step 1: DNI lookup
  const [dni, setDni] = useState('')
  const [reniecData, setReniecData] = useState<ReniecData | null>(null)
  const [lookingUp, setLookingUp] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const dniRef = useRef<HTMLInputElement>(null)

  // Step 2: credentials
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fechaNacimiento, setFechaNacimiento] = useState('')

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Auto-lookup when DNI reaches 8 digits
  useEffect(() => {
    if (dni.length !== 8) { setReniecData(null); setNotFound(false); return }

    let cancelled = false
    const lookup = async () => {
      setLookingUp(true)
      setNotFound(false)
      setReniecData(null)
      try {
        const res = await authService.consultarReniec(dni)
        // ApiResponse wrapper: res.data = { success, data: { nombres, apellidoPaterno, apellidoMaterno } }
        const payload = res.data?.data as ReniecData | null
        if (!cancelled) {
          if (payload?.nombres) {
            setReniecData(payload)
          } else {
            setNotFound(true)
          }
        }
      } catch {
        if (!cancelled) setNotFound(true)
      } finally {
        if (!cancelled) setLookingUp(false)
      }
    }
    lookup()
    return () => { cancelled = true }
  }, [dni])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!reniecData && !notFound) { setError('Ingresa tu DNI para continuar.'); return }
    if (password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres.'); return }
    if (!fechaNacimiento) { setError('Ingresa tu fecha de nacimiento.'); return }

    const nombres = reniecData?.nombres ?? ''
    const apePat  = reniecData?.apellidoPaterno ?? ''
    const apeMat  = reniecData?.apellidoMaterno ?? ''

    if (!nombres && !notFound) { setError('No se pudieron obtener tus datos del DNI.'); return }

    setLoading(true)
    try {
      await authService.signUp({ email, password, nombres, apePat, apeMat, dni, fechaNacimiento })
      navigate('/pending')
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string; data?: Record<string, string> } } }
      const data = axiosErr?.response?.data
      if (data?.data && typeof data.data === 'object') {
        setError(Object.values(data.data)[0] ?? 'Error al registrarse.')
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
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="glass rounded-3xl p-8 shadow-2xl border border-white/20">
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 bg-gold-500 rounded-2xl flex items-center justify-center shadow-xl mb-4">
              <Cross className="w-7 h-7 text-dark-900" />
            </div>
            <h1 className="font-display text-2xl font-bold text-white">Solicitar acceso</h1>
            <p className="text-slate-400 text-sm mt-1 text-center max-w-xs">
              Un administrador revisará y aprobará tu cuenta.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
              <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* DNI field */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-1.5">
                DNI <span className="text-slate-500 font-normal">(8 dígitos)</span>
              </label>
              <div className="relative">
                <input
                  ref={dniRef}
                  type="text"
                  value={dni}
                  onChange={e => setDni(e.target.value.replace(/\D/g, '').slice(0, 8))}
                  placeholder="12345678"
                  maxLength={8}
                  required
                  className="w-full px-4 py-3 pr-10 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-500
                             focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2">
                  {lookingUp && <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />}
                  {!lookingUp && reniecData && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                  {!lookingUp && notFound && <Search className="w-4 h-4 text-slate-500" />}
                </span>
              </div>
            </div>

            {/* RENIEC result */}
            {reniecData && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-3 flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <p className="text-white text-sm font-semibold">
                    {reniecData.nombres} {reniecData.apellidoPaterno} {reniecData.apellidoMaterno}
                  </p>
                  <p className="text-slate-400 text-xs mt-0.5">Datos obtenidos de RENIEC</p>
                </div>
              </div>
            )}

            {/* Not found — manual fallback (hidden inputs filled with placeholder) */}
            {notFound && (
              <p className="text-amber-400 text-xs">
                DNI no encontrado en RENIEC. Podrás completar tu perfil más tarde.
              </p>
            )}

            {/* Fecha nacimiento — always required */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-1.5">Fecha de nacimiento</label>
              <input
                type="date"
                value={fechaNacimiento}
                onChange={e => setFechaNacimiento(e.target.value)}
                required
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-500
                           focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all
                           [color-scheme:dark]"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-1.5">Correo electrónico</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
                required
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-500
                           focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-1.5">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-500
                           focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading || lookingUp}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gold-500 hover:bg-gold-400
                         text-dark-900 font-semibold rounded-xl transition-all duration-200 hover:shadow-lg
                         hover:shadow-gold-500/30 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <UserPlus className="w-4 h-4" />
              )}
              {loading ? 'Enviando solicitud...' : 'Enviar solicitud'}
            </button>
          </form>

          <div className="mt-6 flex flex-col items-center gap-2 text-sm">
            <p className="text-slate-400">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
                Iniciar sesión
              </Link>
            </p>
            <Link to="/" className="text-slate-500 hover:text-slate-300 transition-colors text-xs">
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
