import { useState, useEffect, useCallback } from 'react'
import { Plus, Pencil, Trash2, Users, Star } from 'lucide-react'
import { cursoService, escuelaService, personaService } from '../../lib/api'
import type { Curso, CursoForm, CursoPersona, Escuela, Persona, PageResponse } from '../../types'
import { useAuth } from '../../context/AuthContext'
import Table, { type Column } from '../../components/ui/Table'
import Pagination from '../../components/ui/Pagination'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import Badge from '../../components/ui/Badge'
import ToastContainer from '../../components/ui/Toast'
import { useToast } from '../../hooks/useToast'
import { getErrorMessage } from '../../lib/apiError'

const EMPTY_FORM: CursoForm = { nombre: '', descripcion: '', escuelaId: 0, profesorPersonaId: undefined, fechaInicio: '', fechaFin: '' }

export default function CursosPage() {
  const { user } = useAuth()
  const toast = useToast()
  const roles = user?.roles ?? []
  const canManage = roles.some(r => ['MAESTRO','ADMIN','SUPER_ADMIN'].includes(r))

  const [page, setPage] = useState(0)
  const [pageData, setPageData] = useState<PageResponse<Curso> | null>(null)
  const [loading, setLoading] = useState(true)
  const [escuelas, setEscuelas] = useState<Escuela[]>([])

  const [modal, setModal] = useState<'none' | 'create' | 'edit'>('none')
  const [form, setForm] = useState<CursoForm>(EMPTY_FORM)
  const [editId, setEditId] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)

  const [inscModal, setInscModal] = useState<Curso | null>(null)
  const [inscritos, setInscritos] = useState<CursoPersona[]>([])
  const [searchInsc, setSearchInsc] = useState('')
  const [personasSearch, setPersonasSearch] = useState<Persona[]>([])
  const [notaEdit, setNotaEdit] = useState<{ personaId: number; nota: string } | null>(null)

  const [deleteTarget, setDeleteTarget] = useState<Curso | null>(null)
  const [deleting, setDeleting] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const r = await cursoService.listar(page)
      setPageData(r.data.data)
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => { load() }, [load])
  useEffect(() => {
    escuelaService.listar(0, 100).then(r => setEscuelas(r.data.data?.content ?? [])).catch(() => {})
  }, [])

  const openCreate = () => { setForm(EMPTY_FORM); setEditId(null); setModal('create') }
  const openEdit = (c: Curso) => {
    setForm({ nombre: c.nombre, descripcion: c.descripcion ?? '', escuelaId: c.escuelaId,
      profesorPersonaId: c.profesorPersonaId, fechaInicio: c.fechaInicio ?? '', fechaFin: c.fechaFin ?? '' })
    setEditId(c.id); setModal('edit')
  }

  const handleSave = async () => {
    if (!form.nombre.trim() || !form.escuelaId) { toast.error('Nombre y escuela son requeridos'); return }
    setSaving(true)
    try {
      if (editId) { await cursoService.actualizar(editId, form); toast.success('Curso actualizado') }
      else { await cursoService.crear(form); toast.success('Curso creado') }
      setModal('none')
      load()
    } catch (err) { toast.error(getErrorMessage(err)) }
    finally { setSaving(false) }
  }

  const openInscripciones = async (c: Curso) => {
    setInscModal(c)
    try {
      const r = await cursoService.inscripciones(c.id)
      setInscritos(r.data.data ?? [])
    } catch (err) { toast.error(getErrorMessage(err)) }
  }

  useEffect(() => {
    if (!searchInsc.trim()) { setPersonasSearch([]); return }
    const t = setTimeout(() => {
      personaService.buscarPorNombre(searchInsc).then(r => setPersonasSearch(r.data.data?.content ?? [])).catch(() => {})
    }, 400)
    return () => clearTimeout(t)
  }, [searchInsc])

  const handleInscribir = async (personaId: number) => {
    if (!inscModal) return
    try {
      await cursoService.inscribir(inscModal.id, personaId)
      toast.success('Persona inscrita')
      const r = await cursoService.inscripciones(inscModal.id)
      setInscritos(r.data.data ?? [])
      setSearchInsc('')
    } catch (err) { toast.error(getErrorMessage(err)) }
  }

  const handleNota = async () => {
    if (!inscModal || !notaEdit) return
    const nota = parseFloat(notaEdit.nota)
    if (isNaN(nota)) { toast.error('Nota inválida'); return }
    try {
      await cursoService.registrarNota(inscModal.id, notaEdit.personaId, nota)
      toast.success('Nota registrada')
      setNotaEdit(null)
      const r = await cursoService.inscripciones(inscModal.id)
      setInscritos(r.data.data ?? [])
    } catch (err) { toast.error(getErrorMessage(err)) }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await cursoService.eliminar(deleteTarget.id)
      toast.success('Curso eliminado')
      setDeleteTarget(null)
      load()
    } catch (err) { toast.error(getErrorMessage(err)) }
    finally { setDeleting(false) }
  }

  const columns: Column<Curso>[] = [
    {
      header: 'Curso',
      render: c => (
        <div>
          <p className="font-medium text-slate-900">{c.nombre}</p>
          <p className="text-xs text-slate-400">{c.escuelaNombre}</p>
        </div>
      ),
    },
    { header: 'Profesor', render: c => <span>{c.profesorNombres ?? '—'}</span> },
    { header: 'Inicio', render: c => <span>{c.fechaInicio ?? '—'}</span> },
    {
      header: 'Estado',
      render: c => <Badge label={c.activo ? 'Activo' : 'Inactivo'} variant={c.activo ? 'green' : 'red'} />,
    },
    {
      header: 'Acciones',
      className: 'w-32',
      render: c => (
        <div className="flex gap-1">
          <button onClick={() => openInscripciones(c)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Inscripciones">
            <Users className="w-4 h-4" />
          </button>
          {canManage && (
            <>
              <button onClick={() => openEdit(c)} className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"><Pencil className="w-4 h-4" /></button>
              <button onClick={() => setDeleteTarget(c)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
            </>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Cursos</h1>
          <p className="text-slate-500 text-sm mt-0.5">Cursos de formación e inscripciones</p>
        </div>
        {canManage && (
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-medium transition-all">
            <Plus className="w-4 h-4" />Nuevo curso
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

      {/* Modal crear/editar */}
      {modal !== 'none' && (
        <Modal title={modal === 'create' ? 'Nuevo curso' : 'Editar curso'} onClose={() => setModal('none')}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
              <input type="text" value={form.nombre} onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Escuela</label>
              <select value={form.escuelaId || ''} onChange={e => setForm(p => ({ ...p, escuelaId: Number(e.target.value) }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300">
                <option value="">Selecciona escuela...</option>
                {escuelas.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
              <textarea value={form.descripcion ?? ''} onChange={e => setForm(p => ({ ...p, descripcion: e.target.value }))}
                rows={3} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Fecha inicio</label>
                <input type="date" value={form.fechaInicio ?? ''} onChange={e => setForm(p => ({ ...p, fechaInicio: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Fecha fin</label>
                <input type="date" value={form.fechaFin ?? ''} onChange={e => setForm(p => ({ ...p, fechaFin: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
              </div>
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

      {/* Modal inscripciones */}
      {inscModal && (
        <Modal title={`Inscripciones: ${inscModal.nombre}`} onClose={() => setInscModal(null)} size="lg">
          {canManage && (
            <div className="mb-4">
              <input type="text" placeholder="Buscar e inscribir persona..." value={searchInsc}
                onChange={e => setSearchInsc(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 mb-2" />
              {personasSearch.length > 0 && (
                <div className="max-h-40 overflow-y-auto rounded-xl border border-slate-200 divide-y">
                  {personasSearch.map(p => (
                    <button key={p.id} onClick={() => handleInscribir(p.id)}
                      className="w-full text-left px-4 py-2.5 hover:bg-primary-50 transition-all text-sm">
                      {p.nombres} {p.apellidoPaterno} — DNI: {p.dni}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {inscritos.map(cp => (
              <div key={cp.personaId} className="flex items-center justify-between px-4 py-3 rounded-xl bg-slate-50">
                <span className="text-sm font-medium text-slate-800">{cp.personaNombres}</span>
                <div className="flex items-center gap-2">
                  {notaEdit?.personaId === cp.personaId ? (
                    <>
                      <input type="number" step="0.1" min="0" max="20" value={notaEdit.nota}
                        onChange={e => setNotaEdit(p => p ? { ...p, nota: e.target.value } : p)}
                        className="w-20 px-2 py-1 rounded-lg border border-slate-200 text-sm text-center" />
                      <button onClick={handleNota} className="px-3 py-1 bg-primary-600 text-white rounded-lg text-xs">OK</button>
                      <button onClick={() => setNotaEdit(null)} className="px-3 py-1 border border-slate-200 rounded-lg text-xs">X</button>
                    </>
                  ) : (
                    <>
                      <span className="text-sm text-slate-500">{cp.nota != null ? `Nota: ${cp.nota}` : 'Sin nota'}</span>
                      {canManage && (
                        <button onClick={() => setNotaEdit({ personaId: cp.personaId, nota: String(cp.nota ?? '') })}
                          className="p-1 text-slate-400 hover:text-amber-500 transition-all">
                          <Star className="w-4 h-4" />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
            {inscritos.length === 0 && <p className="text-center py-6 text-slate-400 text-sm">Sin inscritos</p>}
          </div>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog title="Eliminar curso" message={`¿Eliminar el curso "${deleteTarget.nombre}"?`}
          confirmLabel="Eliminar" onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={deleting} />
      )}
    </div>
  )
}
