import { Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Sidebar from '../components/layout/Sidebar'
import Overview from '../components/dashboard/Overview'
import { adminService } from '../lib/api'
import type { MiembroPendiente } from '../types'
import { CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react'

// ── Lazy-import all dashboard pages ──────────────────────────────────────────
import PersonasPage      from './dashboard/PersonasPage'
import MiembrosPage      from './dashboard/MiembrosPage'
import SesionesPage      from './dashboard/SesionesPage'
import AsistenciasPage   from './dashboard/AsistenciasPage'
import EscuelasPage      from './dashboard/EscuelasPage'
import CursosPage        from './dashboard/CursosPage'
import MinisteriosPage   from './dashboard/MinisteriosPage'
import CelulasPage       from './dashboard/CelulasPage'
import SedesPage         from './dashboard/SedesPage'
import EventosPage       from './dashboard/EventosPage'
import OtrasIglesiasPage from './dashboard/OtrasIglesiasPage'
import IngresosPage      from './dashboard/IngresosPage'
import EgresosPage       from './dashboard/EgresosPage'
import ReportesPage      from './dashboard/ReportesPage'
import RolesPage         from './dashboard/RolesPage'
import HuellasPage       from './dashboard/HuellasPage'
import MiPerfilPage      from './dashboard/MiPerfilPage'
import CumpleaniosPage   from './dashboard/CumpleaniosPage'

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route index                  element={<Overview />} />
          <Route path="personas"        element={<PersonasPage />} />
          <Route path="miembros"        element={<MiembrosPage />} />
          <Route path="sesiones"        element={<SesionesPage />} />
          <Route path="asistencias"     element={<AsistenciasPage />} />
          <Route path="escuelas"        element={<EscuelasPage />} />
          <Route path="cursos"          element={<CursosPage />} />
          <Route path="ministerios"     element={<MinisteriosPage />} />
          <Route path="celulas"         element={<CelulasPage />} />
          <Route path="sedes"           element={<SedesPage />} />
          <Route path="eventos"         element={<EventosPage />} />
          <Route path="otras-iglesias"  element={<OtrasIglesiasPage />} />
          <Route path="ingresos"        element={<IngresosPage />} />
          <Route path="egresos"         element={<EgresosPage />} />
          <Route path="reportes"        element={<ReportesPage />} />
          <Route path="roles"           element={<RolesPage />} />
          <Route path="huellas"         element={<HuellasPage />} />
          <Route path="aprobaciones"    element={<AprobacionesPage />} />
          <Route path="mi-perfil"       element={<MiPerfilPage />} />
          <Route path="cumpleanios"     element={<CumpleaniosPage />} />
        </Routes>
      </main>
    </div>
  )
}

// ── Página de aprobaciones ────────────────────────────────────────────────────

function AprobacionesPage() {
  const [miembros, setMiembros] = useState<MiembroPendiente[]>([])
  const [loading, setLoading]   = useState(true)
  const [actionId, setActionId] = useState<number | null>(null)

  const cargar = async () => {
    setLoading(true)
    try {
      const { data } = await adminService.miembrosPendientes()
      setMiembros(data.data ?? [])
    } catch {
      setMiembros([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { cargar() }, [])

  const handleAprobar = async (id: number) => {
    setActionId(id)
    try {
      await adminService.aprobar(id)
      setMiembros(prev => prev.filter(m => m.idMiembro !== id))
    } finally {
      setActionId(null)
    }
  }

  const handleRechazar = async (id: number) => {
    if (!confirm('¿Seguro que deseas rechazar esta solicitud?')) return
    setActionId(id)
    try {
      await adminService.rechazar(id)
      setMiembros(prev => prev.filter(m => m.idMiembro !== id))
    } finally {
      setActionId(null)
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Solicitudes de acceso</h1>
          <p className="text-slate-500 text-sm mt-1">Aprueba o rechaza las solicitudes de nuevos miembros.</p>
        </div>
        <button
          onClick={cargar}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all text-sm"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Actualizar
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : miembros.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-emerald-500" />
          </div>
          <div>
            <p className="text-slate-700 font-semibold">Sin solicitudes pendientes</p>
            <p className="text-slate-400 text-sm mt-1">Todas las solicitudes han sido procesadas.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {miembros.map(m => (
            <div
              key={m.idMiembro}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col sm:flex-row sm:items-center gap-4"
            >
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-primary-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900">
                  {m.nombres} {m.apePat} {m.apeMat}
                </p>
                <p className="text-slate-500 text-sm">{m.email}</p>
                <div className="flex gap-3 text-xs text-slate-400 mt-1">
                  <span>DNI: {m.dni}</span>
                  <span>·</span>
                  <span>Nac: {m.fechaNacimiento}</span>
                  <span>·</span>
                  <span>Solicitud: {m.fechaConversion}</span>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => handleAprobar(m.idMiembro)}
                  disabled={actionId === m.idMiembro}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-medium transition-all disabled:opacity-60"
                >
                  <CheckCircle className="w-4 h-4" />
                  Aprobar
                </button>
                <button
                  onClick={() => handleRechazar(m.idMiembro)}
                  disabled={actionId === m.idMiembro}
                  className="flex items-center gap-1.5 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-medium transition-all disabled:opacity-60"
                >
                  <XCircle className="w-4 h-4" />
                  Rechazar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
