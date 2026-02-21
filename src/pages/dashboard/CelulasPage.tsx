import { useState, useEffect, useCallback } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { celulaService, sedeService } from '../../lib/api'
import type { Celula, CelulaForm, TipoCelula, Sede, PageResponse } from '../../types'
import { useAuth } from '../../context/AuthContext'
import Table, { type Column } from '../../components/ui/Table'
import Pagination from '../../components/ui/Pagination'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import Badge from '../../components/ui/Badge'
import ToastContainer from '../../components/ui/Toast'
import { useToast } from '../../hooks/useToast'
import { getErrorMessage } from '../../lib/apiError'

const TIPOS: TipoCelula[] = ['DAMAS','VARONES','JOVENES','MATRIMONIOS','ADOLESCENTES','NINOS','GENERAL']
const EMPTY_FORM: CelulaForm = { nombre: '', tipoCelula: 'GENERAL', descripcion: '', liderPersonaId: undefined, sedeId: undefined }

export default function CelulasPage() {
  const { user } = useAuth()
  const toast = useToast()
  const roles = user?.roles ?? []
  const canManage = roles.some(r => ['ADMIN','SUPER_ADMIN'].includes(r))

  const [page, setPage] = useState(0)
  const [pageData, setPageData] = useState<PageResponse<Celula> | null>(null)
  const [loading, setLoading] = useState(true)
  const [sedes, setSedes] = useState<Sede[]>([])

  const [modal, setModal] = useState<'none' | 'create' | 'edit'>('none')
  const [form, setForm] = useState<CelulaForm>(EMPTY_FORM)
  const [editId, setEditId] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Celula | null>(null)
  const [deleting, setDeleting] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const r = await celulaService.listar(page)
      setPageData(r.data.data)
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => { load() }, [load])
  useEffect(() => {
    sedeService.listar(0, 100).then(r => setSedes(r.data.data?.content ?? [])).catch(() => {})
  }, [])

  const openCreate = () => { setForm(EMPTY_FORM); setEditId(null); setModal('create') }
  const openEdit = (c: Celula) => {
    setForm({ nombre: c.nombre, tipoCelula: c.tipoCelula, descripcion: c.descripcion ?? '',
      liderPersonaId: c.liderPersonaId, sedeId: c.sedeId })
    setEditId(c.id); setModal('edit')
  }

  const handleSave = async () => {
    if (!form.nombre.trim()) { toast.error('El nombre es requerido'); return }
    setSaving(true)
    try {
      if (editId) { await celulaService.actualizar(editId, form); toast.success('Célula actualizada') }
      else { await celulaService.crear(form); toast.success('Célula creada') }
      setModal('none'); load()
    } catch (err) { toast.error(getErrorMessage(err)) }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await celulaService.eliminar(deleteTarget.id)
      toast.success('Célula eliminada')
      setDeleteTarget(null); load()
    } catch (err) { toast.error(getErrorMessage(err)) }
    finally { setDeleting(false) }
  }

  const tipoColor: Record<TipoCelula, 'blue' | 'purple' | 'green' | 'gold' | 'yellow' | 'red' | 'gray'> = {
    DAMAS: 'purple', VARONES: 'blue', JOVENES: 'green', MATRIMONIOS: 'gold',
    ADOLESCENTES: 'yellow', NINOS: 'red', GENERAL: 'gray',
  }

  const columns: Column<Celula>[] = [
    {
      header: 'Célula',
      render: c => (
        <div>
          <p className="font-medium text-slate-900">{c.nombre}</p>
          {c.descripcion && <p className="text-xs text-slate-400">{c.descripcion}</p>}
        </div>
      ),
    },
    { header: 'Tipo', render: c => <Badge label={c.tipoCelula} variant={tipoColor[c.tipoCelula]} /> },
    { header: 'Líder', render: c => <span>{c.liderNombres ?? '—'}</span> },
    { header: 'Sede', render: c => <span>{c.sedeNombre ?? '—'}</span> },
    { header: 'Estado', render: c => <Badge label={c.activo ? 'Activo' : 'Inactivo'} variant={c.activo ? 'green' : 'red'} /> },
    canManage ? {
      header: 'Acciones', className: 'w-24',
      render: c => (
        <div className="flex gap-1">
          <button onClick={() => openEdit(c)} className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"><Pencil className="w-4 h-4" /></button>
          <button onClick={() => setDeleteTarget(c)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
        </div>
      ),
    } : { header: '', render: () => null },
  ]

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Células</h1>
          <p className="text-slate-500 text-sm mt-0.5">Grupos pequeños de la iglesia</p>
        </div>
        {canManage && (
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-medium transition-all">
            <Plus className="w-4 h-4" />Nueva
          </button>
        )}
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
        <Table columns={columns} data={pageData?.content ?? []} loading={loading} rowKey={c => c.id} />
        {pageData && (
          <div className="px-4">
            <Pagination page={pageData.number} totalPages={pageData.totalPages}
              totalElements={pageData.totalElements} size={pageData.size} onPageChange={setPage} />
          </div>
        )}
      </div>

      {modal !== 'none' && (
        <Modal title={modal === 'create' ? 'Nueva célula' : 'Editar célula'} onClose={() => setModal('none')}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
              <input type="text" value={form.nombre} onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tipo</label>
              <select value={form.tipoCelula} onChange={e => setForm(p => ({ ...p, tipoCelula: e.target.value as TipoCelula }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300">
                {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
              <textarea value={form.descripcion ?? ''} onChange={e => setForm(p => ({ ...p, descripcion: e.target.value }))}
                rows={2} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 resize-none" />
            </div>
            {sedes.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Sede</label>
                <select value={form.sedeId ?? ''} onChange={e => setForm(p => ({ ...p, sedeId: e.target.value ? Number(e.target.value) : undefined }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300">
                  <option value="">Sin sede</option>
                  {sedes.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
                </select>
              </div>
            )}
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
        <ConfirmDialog title="Eliminar célula" message={`¿Eliminar "${deleteTarget.nombre}"?`}
          confirmLabel="Eliminar" onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={deleting} />
      )}
    </div>
  )
}
