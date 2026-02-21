import { useState, useEffect, useCallback, useRef } from 'react'
import { Scan, UserPlus, RefreshCw } from 'lucide-react'
import { asistenciaService, sesionCultoService, personaService } from '../../lib/api'
import type { Asistencia, SesionCulto, PageResponse, Persona } from '../../types'
import { useAuth } from '../../context/AuthContext'
import Table, { type Column } from '../../components/ui/Table'
import Pagination from '../../components/ui/Pagination'
import Badge from '../../components/ui/Badge'
import ToastContainer from '../../components/ui/Toast'
import { useToast } from '../../hooks/useToast'
import { getErrorMessage } from '../../lib/apiError'
import Modal from '../../components/ui/Modal'

export default function AsistenciasPage() {
  const { user } = useAuth()
  const toast = useToast()
  const roles = user?.roles ?? []
  const canRegister = roles.some(r => ['ENCARGADO','ADMIN','SUPER_ADMIN'].includes(r))

  const [, setSesionActiva] = useState<SesionCulto | null>(null)
  const [sesiones, setSesiones] = useState<SesionCulto[]>([])
  const [selectedSesionId, setSelectedSesionId] = useState<number | ''>('')
  const [pageData, setPageData] = useState<PageResponse<Asistencia> | null>(null)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)

  const [dni, setDni] = useState('')
  const [scanning, setScanning] = useState(false)
  const dniRef = useRef<HTMLInputElement>(null)

  const [modalManual, setModalManual] = useState(false)
  const [searchPersona, setSearchPersona] = useState('')
  const [personas, setPersonas] = useState<Persona[]>([])
  const [saving, setSaving] = useState(false)

  const loadSesiones = useCallback(async () => {
    try {
      const [activaRes, listRes] = await Promise.allSettled([
        sesionCultoService.sesionAbierta(),
        sesionCultoService.listar(0, 50),
      ])
      if (activaRes.status === 'fulfilled') {
        const activa = activaRes.value.data.data
        setSesionActiva(activa)
        if (activa) setSelectedSesionId(activa.id)
      } else setSesionActiva(null)
      if (listRes.status === 'fulfilled') setSesiones(listRes.value.data.data?.content ?? [])
    } catch {}
  }, [])

  const loadAsistencias = useCallback(async () => {
    if (!selectedSesionId) return
    setLoading(true)
    try {
      const r = await asistenciaService.porSesion(Number(selectedSesionId), page)
      setPageData(r.data.data)
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [selectedSesionId, page])

  useEffect(() => { loadSesiones() }, [loadSesiones])
  useEffect(() => { loadAsistencias() }, [loadAsistencias])

  const handleDniSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!dni.trim()) return
    setScanning(true)
    try {
      await asistenciaService.registrarPorDni(dni.trim())
      toast.success(`Asistencia registrada: DNI ${dni}`)
      setDni('')
      loadAsistencias()
    } catch (err: any) {
      const msg = err.response?.data?.message ?? 'Error al registrar'
      toast.error(msg)
    } finally {
      setScanning(false)
      dniRef.current?.focus()
    }
  }

  const searchPersonas = useCallback(async (q: string) => {
    if (!q.trim()) { setPersonas([]); return }
    try {
      // Si parece un DNI (solo dígitos), buscar por DNI exacto
      if (/^\d+$/.test(q.trim())) {
        const r = await personaService.buscarPorDni(q.trim())
        const p = r.data.data
        setPersonas(p ? [p] : [])
      } else {
        const r = await personaService.buscarPorNombre(q.trim())
        setPersonas(r.data.data?.content ?? [])
      }
    } catch { setPersonas([]) }
  }, [])

  useEffect(() => {
    const t = setTimeout(() => searchPersonas(searchPersona), 400)
    return () => clearTimeout(t)
  }, [searchPersona, searchPersonas])

  const handleManual = async (personaId: number) => {
    if (!user?.personaId) { toast.error('Sin ID de persona'); return }
    setSaving(true)
    try {
      await asistenciaService.registrarManual(personaId, user.personaId, selectedSesionId ? Number(selectedSesionId) : undefined)
      toast.success('Asistencia registrada manualmente')
      setModalManual(false)
      setSearchPersona('')
      setPersonas([])
      loadAsistencias()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  const columns: Column<Asistencia>[] = [
    {
      header: 'Persona',
      render: a => (
        <div>
          <p className="font-medium text-slate-900">{a.personaNombres ?? '—'}</p>
          {a.personaDni && <p className="text-xs text-slate-400">DNI: {a.personaDni}</p>}
        </div>
      ),
    },
    {
      header: 'Método',
      render: a => {
        const variant = a.tipoRegistro === 'MANUAL' ? 'blue' : a.tipoRegistro === 'HUELLA_DACTILAR' ? 'green' : a.tipoRegistro === 'CODIGO_QR' ? 'purple' : 'gray'
        const label = a.tipoRegistro === 'CODIGO_QR' ? 'QR' : a.tipoRegistro === 'HUELLA_DACTILAR' ? 'Huella' : 'Manual'
        return <Badge label={label} variant={variant} />
      },
    },
    {
      header: 'Hora',
      render: a => {
        if (!a.fechaAsistencia) return <span className="text-slate-400">—</span>
        const d = new Date(a.fechaAsistencia)
        return <span>{isNaN(d.getTime()) ? '—' : d.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}</span>
      },
    },
  ]

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Asistencias</h1>
          <p className="text-slate-500 text-sm mt-0.5">Registro de asistencia a cultos</p>
        </div>
        <div className="flex gap-2">
          <button onClick={loadAsistencias} className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-all">
            <RefreshCw className="w-4 h-4" />
          </button>
          {canRegister && (
            <button onClick={() => setModalManual(true)} className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-xl text-sm font-medium transition-all">
              <UserPlus className="w-4 h-4" />Manual
            </button>
          )}
        </div>
      </div>

      {/* Registro por DNI */}
      {canRegister && (
        <form onSubmit={handleDniSubmit} className="mb-4">
          <div className="flex gap-3 p-4 bg-primary-50 border border-primary-200 rounded-2xl">
            <div className="flex items-center gap-2 text-primary-700">
              <Scan className="w-5 h-5" />
              <span className="text-sm font-medium">Escanear DNI:</span>
            </div>
            <input
              ref={dniRef}
              type="text"
              inputMode="numeric"
              placeholder="Ingresa o escanea DNI..."
              value={dni}
              onChange={e => setDni(e.target.value)}
              autoFocus
              className="flex-1 px-3 py-2 rounded-xl border border-primary-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white"
            />
            <button
              type="submit"
              disabled={scanning || !dni.trim()}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-medium transition-all disabled:opacity-60"
            >
              {scanning ? 'Registrando...' : 'Registrar'}
            </button>
          </div>
        </form>
      )}

      {/* Selector de sesión */}
      <div className="mb-4 flex items-center gap-3">
        <label className="text-sm font-medium text-slate-700 shrink-0">Ver sesión:</label>
        <select
          value={selectedSesionId}
          onChange={e => { setSelectedSesionId(e.target.value ? Number(e.target.value) : ''); setPage(0) }}
          className="flex-1 max-w-xs px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
        >
          <option value="">Selecciona sesión...</option>
          {sesiones.map(s => (
            <option key={s.id} value={s.id}>
              {s.nombreSesion} {s.abierta ? '(activa)' : ''}
            </option>
          ))}
        </select>
        {pageData && (
          <span className="text-sm text-slate-500">{pageData.totalElements} asistentes</span>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
        <Table
          columns={columns}
          data={pageData?.content ?? []}
          loading={loading}
          rowKey={a => a.id}
          emptyMessage={selectedSesionId ? 'Sin asistencias en esta sesión' : 'Selecciona una sesión'}
        />
        {pageData && (
          <div className="px-4">
            <Pagination page={pageData.number} totalPages={pageData.totalPages}
              totalElements={pageData.totalElements} size={pageData.size} onPageChange={setPage} />
          </div>
        )}
      </div>

      {/* Modal manual */}
      {modalManual && (
        <Modal title="Registrar asistencia manual" onClose={() => { setModalManual(false); setSearchPersona(''); setPersonas([]) }}>
          <div>
            <input
              type="text"
              placeholder="Buscar por nombre o DNI..."
              value={searchPersona}
              onChange={e => setSearchPersona(e.target.value)}
              autoFocus
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 mb-3"
            />
            <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 rounded-xl border border-slate-200">
              {personas.length === 0 && searchPersona.length > 1 && (
                <p className="text-center py-6 text-slate-400 text-sm">Sin resultados</p>
              )}
              {personas.map(p => (
                <button
                  key={p.id}
                  onClick={() => handleManual(p.id)}
                  disabled={saving}
                  className="w-full text-left px-4 py-3 hover:bg-primary-50 transition-all"
                >
                  <p className="font-medium text-slate-900 text-sm">{p.nombres} {p.apellidoPaterno} {p.apellidoMaterno}</p>
                  <p className="text-xs text-slate-400">DNI: {p.dni}</p>
                </button>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
