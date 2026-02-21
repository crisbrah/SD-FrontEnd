import { useState, useEffect, useCallback } from 'react'
import { Plus, Pencil, Trash2, TrendingDown, Search, X } from 'lucide-react'
import { egresoService, personaService } from '../../lib/api'
import type { Egreso, EgresoForm, TipoEgreso, PageResponse, Persona } from '../../types'
import { useAuth } from '../../context/AuthContext'
import Table, { type Column } from '../../components/ui/Table'
import Pagination from '../../components/ui/Pagination'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import Badge from '../../components/ui/Badge'
import ToastContainer from '../../components/ui/Toast'
import { useToast } from '../../hooks/useToast'
import { getErrorMessage } from '../../lib/apiError'

const TIPOS: TipoEgreso[] = ['ALQUILER','SERVICIOS_BASICOS','MATERIALES','TRANSPORTE','ALIMENTACION','OTRO']
const TIPO_COLORS: Record<TipoEgreso, 'red' | 'yellow' | 'blue' | 'purple' | 'gold' | 'gray'> = {
  ALQUILER: 'red', SERVICIOS_BASICOS: 'yellow', MATERIALES: 'blue',
  TRANSPORTE: 'purple', ALIMENTACION: 'gold', OTRO: 'gray',
}

const now = new Date()
const EMPTY_FORM: EgresoForm = {
  monto: 0, descripcion: '', tipoEgreso: 'OTRO',
  fecha: now.toISOString().split('T')[0], personaId: undefined,
}

export default function EgresosPage() {
  const { user } = useAuth()
  const toast = useToast()
  const roles = user?.roles ?? []
  const canManage = roles.some(r => ['TESORERO','ADMIN','SUPER_ADMIN'].includes(r))

  const [page, setPage] = useState(0)
  const [pageData, setPageData] = useState<PageResponse<Egreso> | null>(null)
  const [loading, setLoading] = useState(true)
  const [totalMes, setTotalMes] = useState<number | null>(null)

  const [mes, setMes] = useState(now.getMonth() + 1)
  const [anio, setAnio] = useState(now.getFullYear())

  const [modal, setModal] = useState<'none' | 'create' | 'edit'>('none')
  const [form, setForm] = useState<EgresoForm>(EMPTY_FORM)
  const [editId, setEditId] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Egreso | null>(null)
  const [deleting, setDeleting] = useState(false)

  // Persona receptora
  const [personaSearch, setPersonaSearch] = useState('')
  const [personaResults, setPersonaResults] = useState<Persona[]>([])
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null)
  const [searchingPersona, setSearchingPersona] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const r = await egresoService.porMes(mes, anio, page)
      const data = r.data.data
      setPageData(data)
      if (data?.content) {
        const total = data.content.reduce((sum: number, e: Egreso) => sum + e.monto, 0)
        setTotalMes(total)
      }
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [mes, anio, page])

  useEffect(() => { load() }, [load])

  const searchPersona = useCallback(async (q: string) => {
    if (q.trim().length < 2) { setPersonaResults([]); return }
    setSearchingPersona(true)
    try {
      const r = await personaService.buscarPorNombre(q.trim(), 0)
      setPersonaResults(r.data.data?.content ?? [])
    } catch { setPersonaResults([]) }
    finally { setSearchingPersona(false) }
  }, [])

  useEffect(() => {
    const t = setTimeout(() => searchPersona(personaSearch), 300)
    return () => clearTimeout(t)
  }, [personaSearch, searchPersona])

  const selectPersona = (p: Persona) => {
    setSelectedPersona(p)
    setForm(prev => ({ ...prev, personaId: p.id }))
    setPersonaSearch('')
    setPersonaResults([])
  }

  const clearPersona = () => {
    setSelectedPersona(null)
    setForm(prev => ({ ...prev, personaId: undefined }))
    setPersonaSearch('')
  }

  const openCreate = () => {
    setForm({ ...EMPTY_FORM }); setEditId(null)
    setSelectedPersona(null); setPersonaSearch(''); setPersonaResults([])
    setModal('create')
  }
  const openEdit = (e: Egreso) => {
    setForm({ monto: e.monto, descripcion: e.descripcion ?? '', tipoEgreso: e.tipoEgreso,
      fecha: e.fecha.split('T')[0], personaId: e.personaId })
    setEditId(e.id)
    setSelectedPersona(e.personaId
      ? { id: e.personaId, nombres: e.personaNombres ?? '', apellidoPaterno: '', apellidoMaterno: '', dni: '', activo: true }
      : null)
    setPersonaSearch(''); setPersonaResults([])
    setModal('edit')
  }

  const handleSave = async () => {
    if (!form.monto || form.monto <= 0) { toast.error('Ingresa un monto válido'); return }
    setSaving(true)
    try {
      if (editId) { await egresoService.actualizar(editId, form); toast.success('Egreso actualizado') }
      else { await egresoService.crear(form); toast.success('Egreso registrado') }
      setModal('none'); load()
    } catch (err) { toast.error(getErrorMessage(err)) }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await egresoService.eliminar(deleteTarget.id)
      toast.success('Egreso eliminado')
      setDeleteTarget(null); load()
    } catch (err) { toast.error(getErrorMessage(err)) }
    finally { setDeleting(false) }
  }

  const columns: Column<Egreso>[] = [
    { header: 'Tipo', render: e => <Badge label={e.tipoEgreso} variant={TIPO_COLORS[e.tipoEgreso]} /> },
    { header: 'Monto', render: e => <span className="font-semibold text-red-600">S/ {e.monto.toFixed(2)}</span> },
    { header: 'Fecha', render: e => <span>{new Date(e.fecha).toLocaleDateString('es-PE')}</span> },
    { header: 'Receptor', render: e => <span className="text-slate-600 text-sm">{e.personaNombres ?? '—'}</span> },
    { header: 'Descripción', render: e => <span className="text-slate-500 text-sm">{e.descripcion ?? '—'}</span> },
    canManage ? {
      header: 'Acciones', className: 'w-24',
      render: e => (
        <div className="flex gap-1">
          <button onClick={() => openEdit(e)} className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"><Pencil className="w-4 h-4" /></button>
          <button onClick={() => setDeleteTarget(e)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
        </div>
      ),
    } : { header: '', render: () => null },
  ]

  const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Egresos</h1>
          <p className="text-slate-500 text-sm mt-0.5">Registro de gastos y egresos</p>
        </div>
        {canManage && (
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-medium transition-all">
            <Plus className="w-4 h-4" />Registrar
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="md:col-span-2 flex gap-3">
          <select value={mes} onChange={e => { setMes(Number(e.target.value)); setPage(0) }}
            className="px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300">
            {MESES.map((m, i) => <option key={i+1} value={i+1}>{m}</option>)}
          </select>
          <input type="number" value={anio} onChange={e => { setAnio(Number(e.target.value)); setPage(0) }}
            min="2020" max="2099"
            className="w-28 px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
        </div>
        {totalMes !== null && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <TrendingDown className="w-5 h-5 text-red-500" />
            <div>
              <p className="text-xs text-red-500">Total del mes</p>
              <p className="text-lg font-bold text-red-600">S/ {totalMes.toFixed(2)}</p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
        <Table columns={columns} data={pageData?.content ?? []} loading={loading} rowKey={e => e.id}
          emptyMessage="Sin egresos en este período" />
        {pageData && (
          <div className="px-4">
            <Pagination page={pageData.number} totalPages={pageData.totalPages}
              totalElements={pageData.totalElements} size={pageData.size} onPageChange={setPage} />
          </div>
        )}
      </div>

      {modal !== 'none' && (
        <Modal title={modal === 'create' ? 'Registrar egreso' : 'Editar egreso'} onClose={() => setModal('none')} size="sm">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Monto (S/)</label>
              <input type="number" step="0.01" min="0" value={form.monto}
                onChange={e => setForm(p => ({ ...p, monto: parseFloat(e.target.value) || 0 }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tipo</label>
              <select value={form.tipoEgreso} onChange={e => setForm(p => ({ ...p, tipoEgreso: e.target.value as TipoEgreso }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300">
                {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Fecha</label>
              <input type="date" value={form.fecha} onChange={e => setForm(p => ({ ...p, fecha: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
              <input type="text" value={form.descripcion ?? ''} onChange={e => setForm(p => ({ ...p, descripcion: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
            </div>
            {/* Persona receptora (opcional) */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Persona receptora <span className="text-slate-400 font-normal text-xs">(opcional)</span>
              </label>
              {selectedPersona ? (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-red-300 bg-red-50">
                  <span className="flex-1 text-sm text-red-800 font-medium">
                    {selectedPersona.nombres} {selectedPersona.apellidoPaterno}
                  </span>
                  <button onClick={clearPersona} className="text-red-400 hover:text-red-600 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Buscar por nombre..."
                    value={personaSearch}
                    onChange={e => setPersonaSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                  />
                  {(personaResults.length > 0 || searchingPersona) && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-10 max-h-40 overflow-y-auto">
                      {searchingPersona && <p className="px-3 py-2 text-xs text-slate-400">Buscando...</p>}
                      {personaResults.map(p => (
                        <button key={p.id} onClick={() => selectPersona(p)}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-red-50 hover:text-red-700 transition-colors">
                          {p.nombres} {p.apellidoPaterno} — <span className="text-slate-400 text-xs">DNI {p.dni}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={() => setModal('none')} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm hover:bg-slate-50">Cancelar</button>
            <button onClick={handleSave} disabled={saving} className="flex-1 px-4 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-medium disabled:opacity-60">
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog title="Eliminar egreso" message={`¿Eliminar este egreso de S/ ${deleteTarget.monto}?`}
          confirmLabel="Eliminar" onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={deleting} />
      )}
    </div>
  )
}
