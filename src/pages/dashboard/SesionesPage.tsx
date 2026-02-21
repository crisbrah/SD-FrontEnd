import { useState, useEffect, useCallback } from 'react'
import { Plus, Radio, CheckCircle, Trash2 } from 'lucide-react'
import { sesionCultoService, sedeService } from '../../lib/api'
import type { SesionCulto, SesionCultoForm, TipoCulto, PageResponse, Sede } from '../../types'
import { useAuth } from '../../context/AuthContext'
import Table, { type Column } from '../../components/ui/Table'
import Pagination from '../../components/ui/Pagination'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import Badge from '../../components/ui/Badge'
import ToastContainer from '../../components/ui/Toast'
import { useToast } from '../../hooks/useToast'
import { getErrorMessage } from '../../lib/apiError'

const TIPOS_CULTO: TipoCulto[] = ['DOMINICAL','ORACION','JOVEN','NINOS','EVANGELISMO','CELULA','ESPECIAL']

const EMPTY_FORM: SesionCultoForm = { nombreSesion: '', tipoCulto: 'DOMINICAL', sedeId: undefined }

export default function SesionesPage() {
  const { user } = useAuth()
  const toast = useToast()
  const roles = user?.roles ?? []
  const canManage = roles.some(r => ['ENCARGADO','ADMIN','SUPER_ADMIN'].includes(r))
  const canDelete = roles.some(r => ['ADMIN','SUPER_ADMIN'].includes(r))

  const [page, setPage] = useState(0)
  const [pageData, setPageData] = useState<PageResponse<SesionCulto> | null>(null)
  const [sesionActiva, setSesionActiva] = useState<SesionCulto | null>(null)
  const [loading, setLoading] = useState(true)
  const [sedes, setSedes] = useState<Sede[]>([])

  const [modalAbrir, setModalAbrir] = useState(false)
  const [form, setForm] = useState<SesionCultoForm>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [closeTarget, setCloseTarget] = useState<SesionCulto | null>(null)
  const [closing, setClosing] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<SesionCulto | null>(null)


  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [listRes, activaRes] = await Promise.allSettled([
        sesionCultoService.listar(page),
        sesionCultoService.sesionAbierta(),
      ])
      if (listRes.status === 'fulfilled') setPageData(listRes.value.data.data)
      if (activaRes.status === 'fulfilled') setSesionActiva(activaRes.value.data.data)
      else setSesionActiva(null)
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    sedeService.listar(0, 100)
      .then(r => setSedes(r.data.data?.content ?? []))
      .catch(() => {})
  }, [])

  const handleAbrir = async () => {
    if (!form.nombreSesion.trim()) { toast.error('Ingresa un nombre para la sesión'); return }
    setSaving(true)
    try {
      await sesionCultoService.abrir(form.nombreSesion, form.tipoCulto, form.sedeId)
      toast.success('Sesión abierta')
      setModalAbrir(false)
      setForm(EMPTY_FORM)
      load()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  const handleCerrar = async () => {
    if (!closeTarget) return
    setClosing(true)
    try {
      await sesionCultoService.cerrar(closeTarget.id)
      toast.success('Sesión cerrada')
      setCloseTarget(null)
      load()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setClosing(false)
    }
  }


  const columns: Column<SesionCulto>[] = [
    {
      header: 'Sesión',
      render: s => (
        <div className="flex items-center gap-2">
          {s.abierta && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
          <div>
            <p className="font-medium text-slate-900">{s.nombreSesion}</p>
            <p className="text-xs text-slate-400">{s.tipoCulto}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Inicio',
      render: s => <span>{new Date(s.fechaInicio).toLocaleString('es-PE')}</span>,
    },
    {
      header: 'Fin',
      render: s => s.fechaFin ? <span>{new Date(s.fechaFin).toLocaleString('es-PE')}</span> : <span className="text-slate-400">—</span>,
    },
    {
      header: 'Estado',
      render: s => <Badge label={s.abierta ? 'Abierta' : 'Cerrada'} variant={s.abierta ? 'green' : 'gray'} />,
    },
    {
      header: 'Asistentes',
      render: s => <span className="font-medium">{s.totalAsistentes ?? '—'}</span>,
    },
    (canManage || canDelete) ? {
      header: 'Acciones',
      className: 'w-28',
      render: s => (
        <div className="flex items-center gap-1">
          {canManage && s.abierta && (
            <button
              onClick={() => setCloseTarget(s)}
              className="flex items-center gap-1 px-2 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg text-xs font-medium transition-all"
            >
              <CheckCircle className="w-3.5 h-3.5" />Cerrar
            </button>
          )}
          {canDelete && !s.abierta && (
            <button
              onClick={() => setDeleteTarget(s)}
              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
              title="Eliminar sesión"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
    } : { header: '', render: () => null },
  ]

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Sesiones de Culto</h1>
          <p className="text-slate-500 text-sm mt-0.5">Historial y control de sesiones</p>
        </div>
        {canManage && !sesionActiva && (
          <button onClick={() => setModalAbrir(true)} className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-medium transition-all">
            <Plus className="w-4 h-4" />Abrir sesión
          </button>
        )}
      </div>

      {/* Sesión activa banner */}
      {sesionActiva && (
        <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
            <Radio className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-emerald-800">Sesión activa: {sesionActiva.nombreSesion}</p>
            <p className="text-sm text-emerald-600">{sesionActiva.tipoCulto} · Iniciada {new Date(sesionActiva.fechaInicio).toLocaleTimeString('es-PE')}</p>
          </div>
          {canManage && (
            <button onClick={() => setCloseTarget(sesionActiva)} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition-all">
              Cerrar sesión
            </button>
          )}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
        <Table columns={columns} data={pageData?.content ?? []} loading={loading} rowKey={s => s.id}
          emptyMessage="No hay sesiones registradas" />
        {pageData && (
          <div className="px-4">
            <Pagination page={pageData.number} totalPages={pageData.totalPages}
              totalElements={pageData.totalElements} size={pageData.size} onPageChange={setPage} />
          </div>
        )}
      </div>

      {modalAbrir && (
        <Modal title="Abrir sesión de culto" onClose={() => setModalAbrir(false)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nombre de la sesión</label>
              <input
                type="text" placeholder="Ej: Culto Dominical 09:00"
                value={form.nombreSesion}
                onChange={e => setForm(p => ({ ...p, nombreSesion: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de culto</label>
              <select
                value={form.tipoCulto}
                onChange={e => setForm(p => ({ ...p, tipoCulto: e.target.value as TipoCulto }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
              >
                {TIPOS_CULTO.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            {sedes.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Sede (opcional)</label>
                <select
                  value={form.sedeId ?? ''}
                  onChange={e => setForm(p => ({ ...p, sedeId: e.target.value ? Number(e.target.value) : undefined }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                >
                  <option value="">Sin sede</option>
                  {sedes.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
                </select>
              </div>
            )}
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={() => setModalAbrir(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm hover:bg-slate-50 transition-all">Cancelar</button>
            <button onClick={handleAbrir} disabled={saving} className="flex-1 px-4 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-medium transition-all disabled:opacity-60">
              {saving ? 'Abriendo...' : 'Abrir sesión'}
            </button>
          </div>
        </Modal>
      )}

      {closeTarget && (
        <ConfirmDialog
          title="Cerrar sesión"
          message={`¿Cerrar la sesión "${closeTarget.nombreSesion}"?`}
          confirmLabel="Cerrar sesión"
          variant="warning"
          onConfirm={handleCerrar}
          onCancel={() => setCloseTarget(null)}
          loading={closing}
        />
      )}
    </div>
  )
}
