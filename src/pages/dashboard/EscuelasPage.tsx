import { useState, useEffect, useCallback } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { escuelaService } from '../../lib/api'
import type { Escuela, EscuelaForm, FaseEscuela, PageResponse } from '../../types'
import { useAuth } from '../../context/AuthContext'
import Table, { type Column } from '../../components/ui/Table'
import Pagination from '../../components/ui/Pagination'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import Badge from '../../components/ui/Badge'
import ToastContainer from '../../components/ui/Toast'
import { useToast } from '../../hooks/useToast'
import { getErrorMessage } from '../../lib/apiError'

const FASES: FaseEscuela[] = ['CONSOLIDACION','DISCIPULADO','LIDERAZGO','MADURACION','FORMACION']
const FASE_COLORS: Record<FaseEscuela, 'blue' | 'green' | 'gold' | 'purple' | 'yellow'> = {
  CONSOLIDACION: 'blue', DISCIPULADO: 'green', LIDERAZGO: 'gold', MADURACION: 'purple', FORMACION: 'yellow',
}

const EMPTY_FORM: EscuelaForm = { nombre: '', descripcion: '', faseEscuela: 'CONSOLIDACION' }

export default function EscuelasPage() {
  const { user } = useAuth()
  const toast = useToast()
  const roles = user?.roles ?? []
  const canManage = roles.some(r => ['MAESTRO','ADMIN','SUPER_ADMIN'].includes(r))

  const [page, setPage] = useState(0)
  const [pageData, setPageData] = useState<PageResponse<Escuela> | null>(null)
  const [loading, setLoading] = useState(true)
  const [filterFase, setFilterFase] = useState<FaseEscuela | ''>('')

  const [modal, setModal] = useState<'none' | 'create' | 'edit'>('none')
  const [form, setForm] = useState<EscuelaForm>(EMPTY_FORM)
  const [editId, setEditId] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Escuela | null>(null)
  const [deleting, setDeleting] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const r = await escuelaService.listar(page)
      setPageData(r.data.data)
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => { load() }, [load])

  const openCreate = () => { setForm(EMPTY_FORM); setEditId(null); setModal('create') }
  const openEdit = (e: Escuela) => {
    setForm({ nombre: e.nombre, descripcion: e.descripcion ?? '', faseEscuela: e.faseEscuela })
    setEditId(e.id)
    setModal('edit')
  }

  const handleSave = async () => {
    if (!form.nombre.trim()) { toast.error('El nombre es requerido'); return }
    setSaving(true)
    try {
      if (editId) { await escuelaService.actualizar(editId, form); toast.success('Escuela actualizada') }
      else { await escuelaService.crear(form); toast.success('Escuela creada') }
      setModal('none')
      load()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await escuelaService.eliminar(deleteTarget.id)
      toast.success('Escuela eliminada')
      setDeleteTarget(null)
      load()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setDeleting(false)
    }
  }

  const filtered = filterFase
    ? (pageData?.content ?? []).filter(e => e.faseEscuela === filterFase)
    : (pageData?.content ?? [])

  const columns: Column<Escuela>[] = [
    {
      header: 'Escuela',
      render: e => (
        <div>
          <p className="font-medium text-slate-900">{e.nombre}</p>
          {e.descripcion && <p className="text-xs text-slate-400">{e.descripcion}</p>}
        </div>
      ),
    },
    {
      header: 'Fase',
      render: e => <Badge label={e.faseEscuela} variant={FASE_COLORS[e.faseEscuela] ?? 'gray'} />,
    },
    {
      header: 'Estado',
      render: e => <Badge label={e.activo ? 'Activo' : 'Inactivo'} variant={e.activo ? 'green' : 'red'} />,
    },
    canManage ? {
      header: 'Acciones',
      className: 'w-24',
      render: e => (
        <div className="flex gap-1">
          <button onClick={() => openEdit(e)} className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"><Pencil className="w-4 h-4" /></button>
          <button onClick={() => setDeleteTarget(e)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
        </div>
      ),
    } : { header: '', render: () => null },
  ]

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Escuelas</h1>
          <p className="text-slate-500 text-sm mt-0.5">Gestión de escuelas de formación</p>
        </div>
        {canManage && (
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-medium transition-all">
            <Plus className="w-4 h-4" />Nueva
          </button>
        )}
      </div>

      {/* Filtro por fase */}
      <div className="flex gap-2 flex-wrap mb-4">
        <button
          onClick={() => setFilterFase('')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${!filterFase ? 'bg-primary-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
        >Todas</button>
        {FASES.map(f => (
          <button
            key={f}
            onClick={() => setFilterFase(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filterFase === f ? 'bg-primary-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >{f}</button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
        <Table columns={columns} data={filtered} loading={loading} rowKey={e => e.id} />
        {pageData && !filterFase && (
          <div className="px-4">
            <Pagination page={pageData.number} totalPages={pageData.totalPages}
              totalElements={pageData.totalElements} size={pageData.size} onPageChange={setPage} />
          </div>
        )}
      </div>

      {modal !== 'none' && (
        <Modal title={modal === 'create' ? 'Nueva escuela' : 'Editar escuela'} onClose={() => setModal('none')}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
              <input type="text" value={form.nombre} onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
              <textarea value={form.descripcion ?? ''} onChange={e => setForm(p => ({ ...p, descripcion: e.target.value }))}
                rows={3} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Fase</label>
              <select value={form.faseEscuela} onChange={e => setForm(p => ({ ...p, faseEscuela: e.target.value as FaseEscuela }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300">
                {FASES.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={() => setModal('none')} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm hover:bg-slate-50 transition-all">Cancelar</button>
            <button onClick={handleSave} disabled={saving} className="flex-1 px-4 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-medium transition-all disabled:opacity-60">
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Eliminar escuela"
          message={`¿Eliminar la escuela "${deleteTarget.nombre}"?`}
          confirmLabel="Eliminar"
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </div>
  )
}
