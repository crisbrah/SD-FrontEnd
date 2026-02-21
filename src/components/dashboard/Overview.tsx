import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Users, Calendar, BookOpen, ClipboardList, TrendingUp,
  AlertCircle, ArrowRight, GraduationCap, Church, DollarSign,
  Fingerprint, Globe, CalendarDays, Radio
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { sesionCultoService, personaService } from '../../lib/api'
import type { SesionCulto } from '../../types'

const modules = [
  { to: '/dashboard/personas',       label: 'Personas',       icon: Users,        color: 'bg-blue-500' },
  { to: '/dashboard/sesiones',       label: 'Sesiones Culto', icon: Calendar,     color: 'bg-purple-500' },
  { to: '/dashboard/asistencias',    label: 'Asistencias',    icon: ClipboardList,color: 'bg-emerald-500' },
  { to: '/dashboard/eventos',        label: 'Eventos',        icon: CalendarDays, color: 'bg-rose-500' },
  { to: '/dashboard/escuelas',       label: 'Escuelas',       icon: GraduationCap,color: 'bg-amber-500' },
  { to: '/dashboard/cursos',         label: 'Cursos',         icon: BookOpen,     color: 'bg-orange-500' },
  { to: '/dashboard/ministerios',    label: 'Ministerios',    icon: Church,       color: 'bg-indigo-500' },
  { to: '/dashboard/ingresos',       label: 'Finanzas',       icon: DollarSign,   color: 'bg-green-600' },
  { to: '/dashboard/huellas',        label: 'Huellas',        icon: Fingerprint,  color: 'bg-slate-600' },
  { to: '/dashboard/otras-iglesias', label: 'Otras Iglesias', icon: Globe,        color: 'bg-cyan-500' },
]

export default function Overview() {
  const { user } = useAuth()
  const [sesion, setSesion]               = useState<SesionCulto | null>(null)
  const [sesionLoading, setSesionLoading] = useState(true)
  const [sesionError, setSesionError]     = useState(false)
  const [totalPersonas, setTotalPersonas] = useState<number | null>(null)
  const [cumpleanios, setCumpleanios]     = useState<number>(0)

  useEffect(() => {
    sesionCultoService.sesionAbierta()
      .then(r => setSesion(r.data.data))
      .catch(() => setSesionError(true))
      .finally(() => setSesionLoading(false))

    personaService.listar(0, 1)
      .then(r => setTotalPersonas(r.data.data?.totalElements ?? null))
      .catch(() => {})

    personaService.cumpleanios()
      .then(r => setCumpleanios((r.data.data ?? []).length))
      .catch(() => {})
  }, [])

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          {getGreeting()},{' '}
          <span className="text-primary-600">{user?.nombres ?? 'bienvenido'}</span>
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Panel de administración — Iglesia Sanidad Divina
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Personas" value={totalPersonas !== null ? String(totalPersonas) : '—'} color="text-blue-600" bg="bg-blue-50" />
        <StatCard icon={Radio} label="Sesión activa" value={sesionLoading ? '...' : sesion ? 'Sí' : 'No'} color={sesion ? 'text-emerald-600' : 'text-slate-500'} bg={sesion ? 'bg-emerald-50' : 'bg-slate-100'} />
        <StatCard icon={CalendarDays} label="Cumpleaños (mes)" value={String(cumpleanios)} color="text-amber-600" bg="bg-amber-50" />
        <StatCard icon={TrendingUp} label="Módulos activos" value="16" color="text-primary-600" bg="bg-primary-50" />
      </div>

      {/* Sesión activa banner */}
      {!sesionLoading && (
        sesion ? (
          <div className="flex items-start gap-4 bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shrink-0">
              <Radio className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-emerald-800 text-sm">Sesión de culto activa</p>
              <p className="text-emerald-600 text-sm truncate">{sesion.nombreSesion} — {sesion.tipoCulto}</p>
            </div>
            <Link
              to="/dashboard/sesiones"
              className="text-emerald-700 hover:text-emerald-900 text-xs font-medium flex items-center gap-1 whitespace-nowrap"
            >
              Ver <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        ) : sesionError ? (
          <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
            <p className="text-amber-700 text-sm">No se pudo verificar la sesión de culto.</p>
          </div>
        ) : (
          <div className="flex items-center gap-3 bg-slate-100 border border-slate-200 rounded-2xl p-4">
            <Calendar className="w-5 h-5 text-slate-400 shrink-0" />
            <p className="text-slate-500 text-sm">No hay ninguna sesión de culto abierta.</p>
            <Link
              to="/dashboard/sesiones"
              className="ml-auto text-primary-600 hover:text-primary-700 text-xs font-medium flex items-center gap-1 whitespace-nowrap"
            >
              Abrir sesión <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        )
      )}

      {/* Module cards */}
      <div>
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Módulos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {modules.map(({ to, label, icon: Icon, color }) => (
            <Link
              key={to}
              to={to}
              className="card p-5 flex flex-col gap-4 hover:border-primary-200 group"
            >
              <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-800 text-sm">{label}</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary-600 group-hover:translate-x-0.5 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, color, bg }: {
  icon: React.ElementType, label: string, value: string, color: string, bg: string
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
      <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center mb-3`}>
        <Icon className={`w-4.5 h-4.5 ${color}`} />
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-xs text-slate-500 mt-0.5">{label}</p>
    </div>
  )
}

function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Buenos días'
  if (h < 18) return 'Buenas tardes'
  return 'Buenas noches'
}
