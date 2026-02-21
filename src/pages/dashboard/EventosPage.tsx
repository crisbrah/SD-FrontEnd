import { useState, useEffect, useCallback } from 'react'
import { Plus, Pencil, Trash2, Users, CheckCircle2, Circle } from 'lucide-react'
import { eventoService, personaService } from '../../lib/api'
import type { Evento, EventoForm, PersonaEvento, Persona, PageResponse } from '../../types'
import { useAuth } from '../../context/AuthContext'
import Table, { type Column } from '../../components/ui/Table'
import Pagination from '../../components/ui/Pagination'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import Badge from '../../components/ui/Badge'
import ToastContainer from '../../components/ui/Toast'
import { useToast } from '../../hooks/useToast'
import { getErrorMessage } from '../../lib/apiError'

const EMPTY_FORM: EventoForm = { nombre: '', descripcion: '', fechaEvento: '', lugarEvento: '' }

export default function EventosPage() {
  const { user } = useAuth()
  const toast = useToast()
  const roles = user?.roles ?? []
  const canManage = roles.some(r => ['ENCARGADO','ADMIN','SUPER_ADMIN'].includes(r))
  // MIEMBRO: solo puede auto-registrarse, no gestionar
  const isMiembro = roles.includes('MIEMBRO') && !canManage
  const [myRegistrations, setMyRegistrations] = useState<Set<number>>(new Set())

  const [page, setPage] = useState(0)
  const [pageData, setPageData] = useState<PageResponse<Evento> | null>(null)
  const [loading, setLoading] = useState(true)

  const [modal, setModal] = useState<'none' | 'create' | 'edit'>('none')
  const [form, setForm] = useState<EventoForm>(EMPTY_FORM)
  const [editId, setEditId] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)

  const [personasModal, setPersonasModal] = useState<Evento | null>(null)
  const [eventoPersonas, setEventoPersonas] = useState<PersonaEvento[]>([])
  const [searchP, setSearchP] = useState('')
  const [searchResults, setSearchResults] = useState<Persona[]>([])

  const [deleteTarget, setDeleteTarget] = useState<Evento | null>(null)
  const [deleting, setDeleting] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const r = await eventoService.listar(page)
      setPageData(r.data.data)
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    if (!searchP.trim()) { setSearchResults([]); return }
    const t = setTimeout(() => {
      personaService.buscarPorNombre(searchP).then(r => setSearchResults(r.data.data?.content ?? [])).catch(() => {})
    }, 400)
    return () => clearTimeout(t)
  }, [searchP])

  const openCreate = () => { setForm(EMPTY_FORM); setEditId(null); setModal('create') }
  const openEdit = (e: Evento) => {
    setForm({ nombre: e.nombre, descripcion: e.descripcion ?? '', fechaEvento: e.fechaEvento, lugarEvento: e.lugarEvento ?? '' })
    setEditId(e.id); setModal('edit')
  }

  const handleSave = async () => {
    if (!form.nombre.trim() || !form.fechaEvento) { toast.error('Nombre y fecha son requeridos'); return }
    setSaving(true)
    try {
      if (editId) { await eventoService.actualizar(editId, form); toast.success('Evento actualizado') }
      else { await eventoService.crear(form); toast.success('Evento creado') }
      setModal('none'); load()
    } catch (err) { toast.error(getErrorMessage(err)) }
    finally { setSaving(false) }
  }

  const openPersonas = async (e: Evento) => {
    setPersonasModal(e)
    try {
      const r = await eventoService.personas(e.id)
      setEventoPersonas(r.data.data ?? [])
    } catch (err) { toast.error(getErrorMessage(err)) }
  }

  const handleAgregar = async (personaId: number) => {
    if (!personasModal) return
    try {
      await eventoService.agregarPersona(personasModal.id, personaId)
      toast.success('Persona agregada al evento')
      const r = await eventoService.personas(personasModal.id)
      setEventoPersonas(r.data.data ?? [])
      setSearchP(''); setSearchResults([])
    } catch (err) { toast.error(getErrorMessage(err)) }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await eventoService.eliminar(deleteTarget.id)
      toast.success('Evento eliminado')
      setDeleteTarget(null); load()
    } catch (err) { toast.error(getErrorMessage(err)) }
    finally { setDeleting(false) }
  }

  // Miembro: toggle auto-registro en un evento
  const handleToggleAsistir = async (evento: Evento) => {
    if (!user?.personaId) { toast.error('Tu cuenta no tiene persona asociada'); return }
    const registered = myRegistrations.has(evento.id)
    try {
      if (registered) {
        await eventoService.quitarPersona(evento.id, user.personaId)
        setMyRegistrations(prev => { const s = new Set(prev); s.delete(evento.id); return s })
        toast.success('Registro cancelado')
      } else {
        await eventoService.agregarPersona(evento.id, user.personaId)
        setMyRegistrations(prev => new Set(prev).add(evento.id))
        toast.success('¡Te registraste al evento!')
      }
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  const columns: Column<Evento>[] = [
    {
      header: 'Evento',
      render: e => (
        <div>
          <p className="font-medium text-slate-900">{e.nombre}</p>
          {e.descripcion && <p className="text-xs text-slate-400">{e.descripcion}</p>}
        </div>
      ),
    },
    { header: 'Fecha', render: e => <span>{new Date(e.fechaEvento).toLocaleDateString('es-PE')}</span> },
    { header: 'Lugar', render: e => <span>{e.lugarEvento ?? '—'}</span> },
    { header: 'Estado', render: e => <Badge label={e.activo ? 'Activo' : 'Inactivo'} variant={e.activo ? 'green' : 'red'} /> },
    {
      header: 'Acciones', className: 'w-36',
      render: e => (
        <div className="flex gap-1 items-center">
          {/* Botón Asistir para MIEMBRO */}
          {isMiembro && e.activo && (
            <button
              onClick={() => handleToggleAsistir(e)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                myRegistrations.has(e.id)
                  ? 'bg-primary-100 text-primary-700 hover:bg-red-50 hover:text-red-600'
                  : 'bg-slate-100 text-slate-600 hover:bg-primary-50 hover:text-primary-700'
              }`}
              title={myRegistrations.has(e.id) ? 'Cancelar asistencia' : 'Confirmar asistencia'}
            >
              {myRegistrations.has(e.id)
                ? <><CheckCircle2 className="w-3.5 h-3.5" />Confirmado</>
                : <><Circle className="w-3.5 h-3.5" />Asistir</>
              }
            </button>
          )}
          {/* Acciones de gestión para encargados */}
          {canManage && (
            <>
              <button onClick={() => openPersonas(e)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Ver personas">
                <Users className="w-4 h-4" />
              </button>
              <button onClick={() => openEdit(e)} className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"><Pencil className="w-4 h-4" /></button>
              <button onClick={() => setDeleteTarget(e)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
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
          <h1 className="text-2xl font-bold text-slate-900">Eventos</h1>
          <p className="text-slate-500 text-sm mt-0.5">Actividades y eventos de la iglesia</p>
        </div>
        {canManage && (
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-medium transition-all">
            <Plus className="w-4 h-4" />Nuevo evento
          </button>
        )}
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
        <Table columns={columns} data={pageData?.content ?? []} loading={loading} rowKey={e => e.id} />
        {pageData && (
          <div className="px-4">
            <Pagination page={pageData.number} totalPages={pageData.totalPages}
              totalElements={pageData.totalElements} size={pageData.size} onPageChange={setPage} />
          </div>
        )}
      </div>

      {modal !== 'none' && (
        <Modal title={modal === 'create' ? 'Nuevo evento' : 'Editar evento'} onClose={() => setModal('none')}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
              <input type="text" value={form.nombre} onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Fecha</label>
              <input type="datetime-local" value={form.fechaEvento} onChange={e => setForm(p => ({ ...p, fechaEvento: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Lugar</label>
              <input type="text" value={form.lugarEvento ?? ''} onChange={e => setForm(p => ({ ...p, lugarEvento: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
              <textarea value={form.descripcion ?? ''} onChange={e => setForm(p => ({ ...p, descripcion: e.target.value }))}
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

      {personasModal && (
        <Modal title={`Personas: ${personasModal.nombre}`} onClose={() => { setPersonasModal(null); setSearchP(''); setSearchResults([]) }} size="lg">
          {canManage && (
            <div className="mb-4">
              <input type="text" placeholder="Agregar persona..." value={searchP} onChange={e => setSearchP(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 mb-2" />
              {searchResults.length > 0 && (
                <div className="max-h-36 overflow-y-auto rounded-xl border border-slate-200 divide-y">
                  {searchResults.map(p => (
                    <button key={p.id} onClick={() => handleAgregar(p.id)}
                      className="w-full text-left px-4 py-2.5 hover:bg-primary-50 transition-all text-sm">
                      {p.nombres} {p.apellidoPaterno}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {eventoPersonas.map(ep => (
              <div key={ep.personaId} className="flex items-center justify-between px-4 py-3 rounded-xl bg-slate-50">
                <span className="text-sm font-medium text-slate-800">{ep.personaNombres}</span>
                <Badge label={ep.confirmado ? 'Confirmado' : 'Pendiente'} variant={ep.confirmado ? 'green' : 'yellow'} />
              </div>
            ))}
            {eventoPersonas.length === 0 && <p className="text-center py-6 text-slate-400 text-sm">Sin personas registradas</p>}
          </div>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog title="Eliminar evento" message={`¿Eliminar el evento "${deleteTarget.nombre}"?`}
          confirmLabel="Eliminar" onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={deleting} />
      )}
    </div>
  )
}
