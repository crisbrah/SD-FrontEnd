import { useState, useEffect, useCallback } from 'react'
import { Search, Plus, Pencil, Trash2, Gift, Info, UserPlus } from 'lucide-react'
import { personaService, miembroService } from '../../lib/api'
import type { Persona, CrearPersonaForm, ActualizarPersonaForm, CargoIglesia, PageResponse } from '../../types'
import { useAuth } from '../../context/AuthContext'
import Table, { type Column } from '../../components/ui/Table'
import Pagination from '../../components/ui/Pagination'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import Badge from '../../components/ui/Badge'
import ToastContainer from '../../components/ui/Toast'
import UbigeoSelector from '../../components/ui/UbigeoSelector'
import { useToast } from '../../hooks/useToast'
import { getErrorMessage } from '../../lib/apiError'

const CARGOS: CargoIglesia[] = [
  'PASTOR','COPASTOR','LIDER_CELULA','LIDER_MINISTERIO',
  'MIEMBRO','VISITANTE','DIACONO','ANCIANO',
]

const EMPTY_CREATE: CrearPersonaForm = {
  dni: '', fechaNacimiento: '', celular: '', fechaBautizo: '',
  lugarNacimiento: '', estadoCivil: '', numeroHijos: undefined,
  ocupacion: '', direccion: '', distrito: '', provincia: '', departamento: '',
  cargo: undefined, iglesiaProcedenciaId: undefined,
}

const EMPTY_UPDATE: ActualizarPersonaForm = {
  fechaNacimiento: '', celular: '', fechaBautizo: '', lugarNacimiento: '', estadoCivil: '',
  numeroHijos: undefined, ocupacion: '', direccion: '', distrito: '',
  provincia: '', departamento: '', cargo: undefined, iglesiaProcedenciaId: undefined,
}

export default function PersonasPage() {
  const { user } = useAuth()
  const toast = useToast()
  const roles = user?.roles ?? []
  const canEdit   = roles.some(r => ['ENCARGADO','MAESTRO','TESORERO','ADMIN','SUPER_ADMIN'].includes(r))
  const canDelete = roles.includes('SUPER_ADMIN')
  const canAdmin  = roles.some(r => ['ADMIN','SUPER_ADMIN'].includes(r))

  const [tab, setTab] = useState<'lista' | 'cumpleanios'>('lista')
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const [pageData, setPageData] = useState<PageResponse<Persona> | null>(null)
  const [loading, setLoading] = useState(true)
  const [cumpleanios, setCumpleanios] = useState<Persona[]>([])

  const [createModal, setCreateModal] = useState(false)
  const [createForm, setCreateForm] = useState<CrearPersonaForm>(EMPTY_CREATE)

  const [editModal, setEditModal] = useState(false)
  const [editForm, setEditForm] = useState<ActualizarPersonaForm>(EMPTY_UPDATE)
  const [editId, setEditId] = useState<number | null>(null)

  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Persona | null>(null)
  const [deleting, setDeleting] = useState(false)

  // Iniciar membresía
  const [iniciarPersona, setIniciarPersona] = useState<Persona | null>(null)
  const [iniciarForm, setIniciarForm] = useState({ email: '', password: '', fechaConversion: new Date().toISOString().split('T')[0] })
  const [iniciando, setIniciando] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = search.trim()
        ? await personaService.buscarPorNombre(search.trim(), page)
        : await personaService.listar(page)
      setPageData(res.data.data)
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [page, search])

  useEffect(() => { if (tab === 'lista') load() }, [load, tab])

  useEffect(() => {
    if (tab !== 'cumpleanios') return
    personaService.cumpleanios(new Date().getMonth() + 1)
      .then(r => setCumpleanios(r.data.data ?? []))
      .catch(err => toast.error(getErrorMessage(err)))
  }, [tab])

  const openEdit = (p: Persona) => {
    setEditForm({
      fechaNacimiento: p.fechaNacimiento ?? '',
      celular: p.celular ?? '', fechaBautizo: p.fechaBautizo ?? '',
      lugarNacimiento: p.lugarNacimiento ?? '', estadoCivil: p.estadoCivil ?? '',
      numeroHijos: p.numeroHijos, ocupacion: p.ocupacion ?? '',
      direccion: p.direccion ?? '', distrito: p.distrito ?? '',
      provincia: p.provincia ?? '', departamento: p.departamento ?? '',
      cargo: p.cargo, iglesiaProcedenciaId: p.iglesiaProcedenciaId,
    })
    setEditId(p.id)
    setEditModal(true)
  }

  const handleCreate = async () => {
    if (!createForm.dni.trim() || createForm.dni.length !== 8) {
      toast.error('El DNI debe tener exactamente 8 dígitos')
      return
    }
    if (!createForm.fechaNacimiento) {
      toast.error('La fecha de nacimiento es requerida')
      return
    }
    setSaving(true)
    try {
      await personaService.crear(createForm)
      toast.success('Persona registrada — datos completados con RENIEC')
      setCreateModal(false)
      setCreateForm(EMPTY_CREATE)
      load()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  const handleUpdate = async () => {
    if (!editId) return
    setSaving(true)
    try {
      await personaService.actualizar(editId, editForm)
      toast.success('Persona actualizada')
      setEditModal(false)
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
      await personaService.eliminar(deleteTarget.id)
      toast.success('Persona eliminada')
      setDeleteTarget(null)
      load()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setDeleting(false)
    }
  }

  const handleIniciarMembresia = async () => {
    if (!iniciarPersona) return
    if (!iniciarForm.email.trim() || !iniciarForm.password.trim()) {
      toast.error('Email y contraseña son requeridos')
      return
    }
    setIniciando(true)
    try {
      await miembroService.crear({
        personaId: iniciarPersona.id,
        email: iniciarForm.email.trim(),
        password: iniciarForm.password,
        fechaConversion: iniciarForm.fechaConversion,
        esNuevo: true,
      })
      toast.success(`Proceso de membresía iniciado para ${iniciarPersona.nombres}. Pendiente de aprobación.`)
      setIniciarPersona(null)
      setIniciarForm({ email: '', password: '', fechaConversion: new Date().toISOString().split('T')[0] })
      load()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setIniciando(false)
    }
  }

  const estadoMembresiaLabel: Record<string, { label: string; variant: 'gray' | 'yellow' | 'green' | 'red' }> = {
    NO_MIEMBRO: { label: 'No miembro', variant: 'gray' },
    PENDIENTE:  { label: 'Pendiente',  variant: 'yellow' },
    APROBADO:   { label: 'Miembro',    variant: 'green' },
    RECHAZADO:  { label: 'Rechazado',  variant: 'red' },
  }

  const columns: Column<Persona>[] = [
    {
      header: 'Persona',
      render: p => (
        <div>
          <p className="font-medium text-slate-900">
            {p.nombres} {p.apellidoPaterno} {p.apellidoMaterno}
          </p>
          <p className="text-xs text-slate-400">DNI: {p.dni}</p>
        </div>
      ),
    },
    { header: 'Celular', render: p => <span>{p.celular ?? '—'}</span> },
    {
      header: 'Cargo',
      render: p => p.cargo
        ? <Badge label={p.cargo} variant="blue" />
        : <span className="text-slate-400 text-xs">—</span>,
    },
    {
      header: 'Estado',
      render: p => <Badge label={p.activo ? 'Activo' : 'Inactivo'} variant={p.activo ? 'green' : 'red'} />,
    },
    {
      header: 'Membresía',
      render: p => {
        const em = p.estadoMembresia ?? 'NO_MIEMBRO'
        const cfg = estadoMembresiaLabel[em] ?? { label: em, variant: 'gray' as const }
        return <Badge label={cfg.label} variant={cfg.variant} />
      },
    },
    {
      header: 'Acciones',
      className: 'w-32',
      render: p => (
        <div className="flex gap-1">
          {canEdit && (
            <button onClick={() => openEdit(p)} className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all" title="Editar">
              <Pencil className="w-4 h-4" />
            </button>
          )}
          {canAdmin && (!p.estadoMembresia || p.estadoMembresia === 'NO_MIEMBRO') && (
            <button onClick={() => setIniciarPersona(p)} className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all" title="Iniciar proceso de membresía">
              <UserPlus className="w-4 h-4" />
            </button>
          )}
          {canDelete && (
            <button onClick={() => setDeleteTarget(p)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Eliminar">
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Personas</h1>
          <p className="text-slate-500 text-sm mt-0.5">Directorio de personas de la iglesia</p>
        </div>
        {canEdit && (
          <button onClick={() => setCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-medium transition-all">
            <Plus className="w-4 h-4" />Nuevo
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {(['lista', 'cumpleanios'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              tab === t ? 'bg-primary-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}>
            {t === 'cumpleanios' && <Gift className="w-4 h-4" />}
            {t === 'lista' ? 'Lista' : 'Cumpleaños'}
          </button>
        ))}
      </div>

      {tab === 'lista' ? (
        <>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Buscar por nombre..."
              value={search} onChange={e => { setSearch(e.target.value); setPage(0) }}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
            <Table columns={columns} data={pageData?.content ?? []} loading={loading} rowKey={p => p.id} />
            {pageData && (
              <div className="px-4">
                <Pagination page={pageData.number} totalPages={pageData.totalPages}
                  totalElements={pageData.totalElements} size={pageData.size} onPageChange={setPage} />
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
          <div className="p-4 border-b border-slate-100 flex items-center gap-2">
            <Gift className="w-5 h-5 text-gold-500" />
            <span className="font-semibold text-slate-800">Cumpleañeros del mes</span>
          </div>
          {cumpleanios.length === 0 ? (
            <p className="text-center py-12 text-slate-400">Sin cumpleaños este mes</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {cumpleanios.map(p => (
                <div key={p.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-sm">🎂</div>
                  <div>
                    <p className="font-medium text-slate-900">{p.nombres} {p.apellidoPaterno}</p>
                    <p className="text-xs text-slate-400">{p.fechaNacimiento}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal CREAR */}
      {createModal && (
        <Modal title="Registrar nueva persona" onClose={() => { setCreateModal(false); setCreateForm(EMPTY_CREATE) }} size="lg">
          {/* Info RENIEC */}
          <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl p-3 mb-5">
            <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700">
              Los <strong>nombres y apellidos</strong> se obtienen automáticamente del DNI consultando RENIEC.
              Solo ingresa el DNI, fecha de nacimiento y datos adicionales opcionales.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Campos requeridos */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                DNI <span className="text-red-500">*</span>
              </label>
              <input type="text" inputMode="numeric" maxLength={8}
                value={createForm.dni}
                onChange={e => setCreateForm(p => ({ ...p, dni: e.target.value.replace(/\D/g, '') }))}
                placeholder="8 dígitos"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Fecha de Nacimiento <span className="text-red-500">*</span>
              </label>
              <input type="date"
                value={createForm.fechaNacimiento}
                onChange={e => setCreateForm(p => ({ ...p, fechaNacimiento: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
            </div>
            {/* Campos opcionales */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Celular</label>
              <input type="tel" value={createForm.celular ?? ''}
                onChange={e => setCreateForm(p => ({ ...p, celular: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Fecha de Bautizo</label>
              <input type="date" value={createForm.fechaBautizo ?? ''}
                onChange={e => setCreateForm(p => ({ ...p, fechaBautizo: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Cargo en Iglesia</label>
              <select value={createForm.cargo ?? ''}
                onChange={e => setCreateForm(p => ({ ...p, cargo: e.target.value as CargoIglesia || undefined }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300">
                <option value="">Sin cargo</option>
                {CARGOS.map(c => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Estado Civil</label>
              <select value={createForm.estadoCivil ?? ''}
                onChange={e => setCreateForm(p => ({ ...p, estadoCivil: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300">
                <option value="">—</option>
                {['Soltero/a','Casado/a','Viudo/a','Divorciado/a'].map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Ocupación</label>
              <input type="text" value={createForm.ocupacion ?? ''}
                onChange={e => setCreateForm(p => ({ ...p, ocupacion: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Número de Hijos</label>
              <input type="number" min="0" value={createForm.numeroHijos ?? ''}
                onChange={e => setCreateForm(p => ({ ...p, numeroHijos: e.target.value ? Number(e.target.value) : undefined }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Lugar de Nacimiento</label>
              <input type="text" value={createForm.lugarNacimiento ?? ''}
                onChange={e => setCreateForm(p => ({ ...p, lugarNacimiento: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Dirección</label>
              <input type="text" value={createForm.direccion ?? ''}
                onChange={e => setCreateForm(p => ({ ...p, direccion: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
            </div>
            <UbigeoSelector
              departamento={createForm.departamento ?? ''}
              provincia={createForm.provincia ?? ''}
              distrito={createForm.distrito ?? ''}
              onChange={(field, value) => setCreateForm(p => ({ ...p, [field]: value }))}
            />
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={() => { setCreateModal(false); setCreateForm(EMPTY_CREATE) }}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm hover:bg-slate-50 transition-all">
              Cancelar
            </button>
            <button onClick={handleCreate} disabled={saving}
              className="flex-1 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium transition-all disabled:opacity-60">
              {saving ? 'Registrando...' : 'Registrar persona'}
            </button>
          </div>
        </Modal>
      )}

      {/* Modal EDITAR */}
      {editModal && (
        <Modal title="Editar persona" onClose={() => setEditModal(false)} size="lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Fecha de Nacimiento</label>
              <input type="date" value={editForm.fechaNacimiento ?? ''}
                onChange={e => setEditForm(p => ({ ...p, fechaNacimiento: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Celular</label>
              <input type="tel" value={editForm.celular ?? ''}
                onChange={e => setEditForm(p => ({ ...p, celular: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Fecha de Bautizo</label>
              <input type="date" value={editForm.fechaBautizo ?? ''}
                onChange={e => setEditForm(p => ({ ...p, fechaBautizo: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Cargo en Iglesia</label>
              <select value={editForm.cargo ?? ''}
                onChange={e => setEditForm(p => ({ ...p, cargo: e.target.value as CargoIglesia || undefined }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300">
                <option value="">Sin cargo</option>
                {CARGOS.map(c => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Estado Civil</label>
              <select value={editForm.estadoCivil ?? ''}
                onChange={e => setEditForm(p => ({ ...p, estadoCivil: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300">
                <option value="">—</option>
                {['Soltero/a','Casado/a','Viudo/a','Divorciado/a'].map(ec => <option key={ec} value={ec}>{ec}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Ocupación</label>
              <input type="text" value={editForm.ocupacion ?? ''}
                onChange={e => setEditForm(p => ({ ...p, ocupacion: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Número de Hijos</label>
              <input type="number" min="0" value={editForm.numeroHijos ?? ''}
                onChange={e => setEditForm(p => ({ ...p, numeroHijos: e.target.value ? Number(e.target.value) : undefined }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Lugar de Nacimiento</label>
              <input type="text" value={editForm.lugarNacimiento ?? ''}
                onChange={e => setEditForm(p => ({ ...p, lugarNacimiento: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Dirección</label>
              <input type="text" value={editForm.direccion ?? ''}
                onChange={e => setEditForm(p => ({ ...p, direccion: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
            </div>
            <UbigeoSelector
              departamento={editForm.departamento ?? ''}
              provincia={editForm.provincia ?? ''}
              distrito={editForm.distrito ?? ''}
              onChange={(field, value) => setEditForm(p => ({ ...p, [field]: value }))}
            />
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={() => setEditModal(false)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm hover:bg-slate-50 transition-all">
              Cancelar
            </button>
            <button onClick={handleUpdate} disabled={saving}
              className="flex-1 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium transition-all disabled:opacity-60">
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Eliminar persona"
          message={`¿Eliminar a ${deleteTarget.nombres} ${deleteTarget.apellidoPaterno}? Esta acción no se puede deshacer.`}
          confirmLabel="Eliminar"
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}

      {/* Modal INICIAR MEMBRESÍA */}
      {iniciarPersona && (
        <Modal title="Iniciar proceso de membresía" onClose={() => setIniciarPersona(null)}>
          <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl p-3 mb-5">
            <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700">
              Se creará una cuenta de acceso para <strong>{iniciarPersona.nombres} {iniciarPersona.apellidoPaterno}</strong>.
              Quedará <strong>pendiente de aprobación</strong> hasta que un administrador la apruebe en la sección Aprobaciones.
            </p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input type="email" value={iniciarForm.email}
                onChange={e => setIniciarForm(p => ({ ...p, email: e.target.value }))}
                placeholder="correo@ejemplo.com"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Contraseña temporal <span className="text-red-500">*</span>
              </label>
              <input type="password" value={iniciarForm.password}
                onChange={e => setIniciarForm(p => ({ ...p, password: e.target.value }))}
                placeholder="Mínimo 6 caracteres"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Fecha de conversión</label>
              <input type="date" value={iniciarForm.fechaConversion}
                onChange={e => setIniciarForm(p => ({ ...p, fechaConversion: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={() => setIniciarPersona(null)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm hover:bg-slate-50 transition-all">
              Cancelar
            </button>
            <button onClick={handleIniciarMembresia} disabled={iniciando}
              className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-all disabled:opacity-60">
              {iniciando ? 'Iniciando...' : 'Iniciar membresía'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
