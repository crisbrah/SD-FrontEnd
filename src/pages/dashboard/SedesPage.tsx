import { useState, useEffect, useCallback } from 'react'
import { Plus, Pencil, Trash2, MapPin } from 'lucide-react'
import { sedeService } from '../../lib/api'
import type { Sede, SedeForm, PageResponse } from '../../types'
import { useAuth } from '../../context/AuthContext'
import Table, { type Column } from '../../components/ui/Table'
import Pagination from '../../components/ui/Pagination'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import Badge from '../../components/ui/Badge'
import ToastContainer from '../../components/ui/Toast'
import { useToast } from '../../hooks/useToast'
import { getErrorMessage } from '../../lib/apiError'

const EMPTY_FORM: SedeForm = { nombre: '', direccion: '', ciudad: '' }

export default function SedesPage() {
  const { user } = useAuth()
  const toast = useToast()
  const roles = user?.roles ?? []
  const canManage = roles.some(r => ['ADMIN','SUPER_ADMIN'].includes(r))

  const [page, setPage] = useState(0)
  const [pageData, setPageData] = useState<PageResponse<Sede> | null>(null)
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<'none' | 'create' | 'edit'>('none')
  const [form, setForm] = useState<SedeForm>(EMPTY_FORM)
  const [editId, setEditId] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Sede | null>(null)
  const [deleting, setDeleting] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const r = await sedeService.listar(page)
      setPageData(r.data.data)
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => { load() }, [load])

  const openCreate = () => { setForm(EMPTY_FORM); setEditId(null); setModal('create') }
  const openEdit = (s: Sede) => {
    setForm({ nombre: s.nombre, direccion: s.direccion ?? '', ciudad: s.ciudad ?? '' })
    setEditId(s.id); setModal('edit')
  }

  const handleSave = async () => {
    if (!form.nombre.trim()) { toast.error('El nombre es requerido'); return }
    setSaving(true)
    try {
      if (editId) { await sedeService.actualizar(editId, form); toast.success('Sede actualizada') }
      else { await sedeService.crear(form); toast.success('Sede creada') }
      setModal('none'); load()
    } catch (err) { toast.error(getErrorMessage(err)) }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await sedeService.eliminar(deleteTarget.id)
      toast.success('Sede eliminada')
      setDeleteTarget(null); load()
    } catch (err) { toast.error(getErrorMessage(err)) }
    finally { setDeleting(false) }
  }

  const columns: Column<Sede>[] = [
    {
      header: 'Sede',
      render: s => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
            <MapPin className="w-4 h-4 text-primary-600" />
          </div>
          <div>
            <p className="font-medium text-slate-900">{s.nombre}</p>
            {s.ciudad && <p className="text-xs text-slate-400">{s.ciudad}</p>}
          </div>
        </div>
      ),
    },
    { header: 'Dirección', render: s => <span>{s.direccion ?? '—'}</span> },
    { header: 'Estado', render: s => <Badge label={s.activo ? 'Activo' : 'Inactivo'} variant={s.activo ? 'green' : 'red'} /> },
    canManage ? {
      header: 'Acciones', className: 'w-24',
      render: s => (
        <div className="flex gap-1">
          <button onClick={() => openEdit(s)} className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"><Pencil className="w-4 h-4" /></button>
          <button onClick={() => setDeleteTarget(s)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
        </div>
      ),
    } : { header: '', render: () => null },
  ]

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Sedes</h1>
          <p className="text-slate-500 text-sm mt-0.5">Ubicaciones de la iglesia</p>
        </div>
        {canManage && (
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-medium transition-all">
            <Plus className="w-4 h-4" />Nueva sede
          </button>
        )}
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
        <Table columns={columns} data={pageData?.content ?? []} loading={loading} rowKey={s => s.id} />
        {pageData && (
          <div className="px-4">
            <Pagination page={pageData.number} totalPages={pageData.totalPages}
              totalElements={pageData.totalElements} size={pageData.size} onPageChange={setPage} />
          </div>
        )}
      </div>

      {modal !== 'none' && (
        <Modal title={modal === 'create' ? 'Nueva sede' : 'Editar sede'} onClose={() => setModal('none')} size="sm">
          <div className="space-y-4">
            {(['nombre', 'ciudad', 'direccion'] as const).map(f => (
              <div key={f}>
                <label className="block text-sm font-medium text-slate-700 mb-1 capitalize">{f}</label>
                <input type="text" value={form[f] ?? ''} onChange={e => setForm(p => ({ ...p, [f]: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
              </div>
            ))}
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
        <ConfirmDialog title="Eliminar sede" message={`¿Eliminar la sede "${deleteTarget.nombre}"?`}
          confirmLabel="Eliminar" onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={deleting} />
      )}
    </div>
  )
}
