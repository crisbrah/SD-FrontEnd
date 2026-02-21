import { useState, useEffect, useCallback } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { rolService } from '../../lib/api'
import type { Rol } from '../../types'
import { useAuth } from '../../context/AuthContext'
import Table, { type Column } from '../../components/ui/Table'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import ToastContainer from '../../components/ui/Toast'
import { useToast } from '../../hooks/useToast'
import { getErrorMessage } from '../../lib/apiError'

export default function RolesPage() {
  const { user } = useAuth()
  const toast = useToast()
  const roles = user?.roles ?? []
  const canManage = roles.some(r => ['ADMIN','SUPER_ADMIN'].includes(r))

  const [data, setData] = useState<Rol[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<'none' | 'create' | 'edit'>('none')
  const [form, setForm] = useState({ nombre: '', descripcion: '' })
  const [editId, setEditId] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Rol | null>(null)
  const [deleting, setDeleting] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const r = await rolService.listar()
      setData(r.data.data ?? [])
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const openCreate = () => { setForm({ nombre: '', descripcion: '' }); setEditId(null); setModal('create') }
  const openEdit = (r: Rol) => { setForm({ nombre: r.nombre, descripcion: r.descripcion ?? '' }); setEditId(r.id); setModal('edit') }

  const handleSave = async () => {
    if (!form.nombre.trim()) { toast.error('El nombre es requerido'); return }
    setSaving(true)
    try {
      if (editId) { await rolService.actualizar(editId, form); toast.success('Rol actualizado') }
      else { await rolService.crear(form); toast.success('Rol creado') }
      setModal('none'); load()
    } catch (err) { toast.error(getErrorMessage(err)) }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await rolService.eliminar(deleteTarget.id)
      toast.success('Rol eliminado')
      setDeleteTarget(null); load()
    } catch (err) { toast.error(getErrorMessage(err)) }
    finally { setDeleting(false) }
  }

  const columns: Column<Rol>[] = [
    { header: '#', render: r => <span className="font-mono text-xs text-slate-400">{r.id}</span> },
    { header: 'Nombre', render: r => <span className="font-semibold text-slate-800">{r.nombre}</span> },
    { header: 'Descripción', render: r => <span className="text-slate-500 text-sm">{r.descripcion ?? '—'}</span> },
    canManage ? {
      header: 'Acciones', className: 'w-24',
      render: r => (
        <div className="flex gap-1">
          <button onClick={() => openEdit(r)} className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"><Pencil className="w-4 h-4" /></button>
          <button onClick={() => setDeleteTarget(r)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
        </div>
      ),
    } : { header: '', render: () => null },
  ]

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Roles</h1>
          <p className="text-slate-500 text-sm mt-0.5">Roles y permisos del sistema</p>
        </div>
        {canManage && (
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-medium transition-all">
            <Plus className="w-4 h-4" />Nuevo rol
          </button>
        )}
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
        <Table columns={columns} data={data} loading={loading} rowKey={r => r.id} />
      </div>

      {modal !== 'none' && (
        <Modal title={modal === 'create' ? 'Nuevo rol' : 'Editar rol'} onClose={() => setModal('none')} size="sm">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
              <input type="text" value={form.nombre} onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
              <textarea value={form.descripcion} onChange={e => setForm(p => ({ ...p, descripcion: e.target.value }))}
                rows={3} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 resize-none" />
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
        <ConfirmDialog title="Eliminar rol" message={`¿Eliminar el rol "${deleteTarget.nombre}"? Los miembros con este rol lo perderán.`}
          confirmLabel="Eliminar" onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={deleting} />
      )}
    </div>
  )
}
