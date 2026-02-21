import { useState, useEffect, useCallback } from 'react'
import { Plus, Pencil, Trash2, Users } from 'lucide-react'
import { ministerioService, personaService } from '../../lib/api'
import type { Ministerio, MinisterioForm, MiembroMinisterio, Persona, PageResponse } from '../../types'
import { useAuth } from '../../context/AuthContext'
import Table, { type Column } from '../../components/ui/Table'
import Pagination from '../../components/ui/Pagination'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import Badge from '../../components/ui/Badge'
import ToastContainer from '../../components/ui/Toast'
import { useToast } from '../../hooks/useToast'
import { getErrorMessage } from '../../lib/apiError'

const EMPTY_FORM: MinisterioForm = { nombre: '', descripcion: '', encargadoPersonaId: undefined }

export default function MinisteriosPage() {
  const { user } = useAuth()
  const toast = useToast()
  const roles = user?.roles ?? []
  const canManage = roles.some(r => ['ADMIN','SUPER_ADMIN'].includes(r))

  const [page, setPage] = useState(0)
  const [pageData, setPageData] = useState<PageResponse<Ministerio> | null>(null)
  const [loading, setLoading] = useState(true)

  const [modal, setModal] = useState<'none' | 'create' | 'edit'>('none')
  const [form, setForm] = useState<MinisterioForm>(EMPTY_FORM)
  const [editId, setEditId] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)

  const [membersModal, setMembersModal] = useState<Ministerio | null>(null)
  const [members, setMembers] = useState<MiembroMinisterio[]>([])
  const [searchMember, setSearchMember] = useState('')
  const [searchResults, setSearchResults] = useState<Persona[]>([])

  const [deleteTarget, setDeleteTarget] = useState<Ministerio | null>(null)
  const [deleting, setDeleting] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const r = await ministerioService.listar(page)
      setPageData(r.data.data)
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    if (!searchMember.trim()) { setSearchResults([]); return }
    const t = setTimeout(() => {
      personaService.buscarPorNombre(searchMember).then(r => setSearchResults(r.data.data?.content ?? [])).catch(() => {})
    }, 400)
    return () => clearTimeout(t)
  }, [searchMember])

  const openCreate = () => { setForm(EMPTY_FORM); setEditId(null); setModal('create') }
  const openEdit = (m: Ministerio) => {
    setForm({ nombre: m.nombre, descripcion: m.descripcion ?? '', encargadoPersonaId: m.encargadoPersonaId })
    setEditId(m.id); setModal('edit')
  }

  const handleSave = async () => {
    if (!form.nombre.trim()) { toast.error('El nombre es requerido'); return }
    setSaving(true)
    try {
      if (editId) { await ministerioService.actualizar(editId, form); toast.success('Ministerio actualizado') }
      else { await ministerioService.crear(form); toast.success('Ministerio creado') }
      setModal('none'); load()
    } catch (err) { toast.error(getErrorMessage(err)) }
    finally { setSaving(false) }
  }

  const openMembers = async (m: Ministerio) => {
    setMembersModal(m)
    try {
      const r = await ministerioService.miembros(m.id)
      setMembers(r.data.data ?? [])
    } catch (err) { toast.error(getErrorMessage(err)) }
  }

  const handleAgregarMiembro = async (personaId: number) => {
    if (!membersModal) return
    try {
      await ministerioService.agregarMiembro(membersModal.id, personaId)
      toast.success('Miembro agregado')
      const r = await ministerioService.miembros(membersModal.id)
      setMembers(r.data.data ?? [])
      setSearchMember(''); setSearchResults([])
    } catch (err) { toast.error(getErrorMessage(err)) }
  }

  const handleQuitarMiembro = async (personaId: number) => {
    if (!membersModal) return
    try {
      await ministerioService.quitarMiembro(membersModal.id, personaId)
      toast.success('Miembro removido')
      setMembers(prev => prev.filter(m => m.personaId !== personaId))
    } catch (err) { toast.error(getErrorMessage(err)) }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await ministerioService.eliminar(deleteTarget.id)
      toast.success('Ministerio eliminado')
      setDeleteTarget(null); load()
    } catch (err) { toast.error(getErrorMessage(err)) }
    finally { setDeleting(false) }
  }

  const columns: Column<Ministerio>[] = [
    {
      header: 'Ministerio',
      render: m => (
        <div>
          <p className="font-medium text-slate-900">{m.nombre}</p>
          {m.descripcion && <p className="text-xs text-slate-400">{m.descripcion}</p>}
        </div>
      ),
    },
    { header: 'Encargado', render: m => <span>{m.encargadoNombres ?? '—'}</span> },
    { header: 'Estado', render: m => <Badge label={m.activo ? 'Activo' : 'Inactivo'} variant={m.activo ? 'green' : 'red'} /> },
    {
      header: 'Acciones', className: 'w-28',
      render: m => (
        <div className="flex gap-1">
          <button onClick={() => openMembers(m)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Ver miembros">
            <Users className="w-4 h-4" />
          </button>
          {canManage && (
            <>
              <button onClick={() => openEdit(m)} className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"><Pencil className="w-4 h-4" /></button>
              <button onClick={() => setDeleteTarget(m)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
            </>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Ministerios</h1>
          <p className="text-slate-500 text-sm mt-0.5">Grupos de ministerio de la iglesia</p>
        </div>
        {canManage && (
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-medium transition-all">
            <Plus className="w-4 h-4" />Nuevo
          </button>
        )}
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
        <Table columns={columns} data={pageData?.content ?? []} loading={loading} rowKey={m => m.id} />
        {pageData && (
          <div className="px-4">
            <Pagination page={pageData.number} totalPages={pageData.totalPages}
              totalElements={pageData.totalElements} size={pageData.size} onPageChange={setPage} />
          </div>
        )}
      </div>

      {modal !== 'none' && (
        <Modal title={modal === 'create' ? 'Nuevo ministerio' : 'Editar ministerio'} onClose={() => setModal('none')}>
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
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={() => setModal('none')} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm hover:bg-slate-50 transition-all">Cancelar</button>
            <button onClick={handleSave} disabled={saving} className="flex-1 px-4 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-medium transition-all disabled:opacity-60">
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </Modal>
      )}

      {membersModal && (
        <Modal title={`Miembros: ${membersModal.nombre}`} onClose={() => { setMembersModal(null); setSearchMember(''); setSearchResults([]) }} size="lg">
          {canManage && (
            <div className="mb-4">
              <input type="text" placeholder="Agregar persona..." value={searchMember}
                onChange={e => setSearchMember(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 mb-2" />
              {searchResults.length > 0 && (
                <div className="max-h-40 overflow-y-auto rounded-xl border border-slate-200 divide-y">
                  {searchResults.map(p => (
                    <button key={p.id} onClick={() => handleAgregarMiembro(p.id)}
                      className="w-full text-left px-4 py-2.5 hover:bg-primary-50 transition-all text-sm">
                      {p.nombres} {p.apellidoPaterno}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {members.map(m => (
              <div key={m.personaId} className="flex items-center justify-between px-4 py-3 rounded-xl bg-slate-50">
                <span className="text-sm font-medium text-slate-800">{m.personaNombres}</span>
                {canManage && (
                  <button onClick={() => handleQuitarMiembro(m.personaId)}
                    className="text-xs text-red-500 hover:text-red-700 transition-colors">Quitar</button>
                )}
              </div>
            ))}
            {members.length === 0 && <p className="text-center py-6 text-slate-400 text-sm">Sin miembros</p>}
          </div>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog title="Eliminar ministerio" message={`¿Eliminar "${deleteTarget.nombre}"?`}
          confirmLabel="Eliminar" onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={deleting} />
      )}
    </div>
  )
}
