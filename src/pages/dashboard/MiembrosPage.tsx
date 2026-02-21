import { useState, useEffect, useCallback } from 'react'
import { Trash2, Tag } from 'lucide-react'
import { miembroService, rolService } from '../../lib/api'
import type { Miembro, Rol, PageResponse } from '../../types'
import { useAuth } from '../../context/AuthContext'
import Table, { type Column } from '../../components/ui/Table'
import Pagination from '../../components/ui/Pagination'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import Badge from '../../components/ui/Badge'
import ToastContainer from '../../components/ui/Toast'
import { useToast } from '../../hooks/useToast'
import { getErrorMessage } from '../../lib/apiError'

export default function MiembrosPage() {
  const { user } = useAuth()
  const toast = useToast()
  const roles = user?.roles ?? []
  const canManage = roles.some(r => ['ADMIN','SUPER_ADMIN'].includes(r))

  const [page, setPage] = useState(0)
  const [pageData, setPageData] = useState<PageResponse<Miembro> | null>(null)
  const [loading, setLoading] = useState(true)
  const [rolesDisp, setRolesDisp] = useState<Rol[]>([])

  const [rolesModal, setRolesModal] = useState<Miembro | null>(null)
  const [miembroRoles, setMiembroRoles] = useState<string[]>([])
  const [savingRol, setSavingRol] = useState(false)

  const [deleteTarget, setDeleteTarget] = useState<Miembro | null>(null)
  const [deleting, setDeleting] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const r = await miembroService.listar(page)
      setPageData(r.data.data)
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    rolService.listar().then(r => setRolesDisp(r.data.data ?? [])).catch(() => {})
  }, [])

  const openRoles = async (m: Miembro) => {
    setRolesModal(m)
    try {
      const r = await miembroService.roles(m.idMiembro)
      const data = r.data.data ?? []
      setMiembroRoles(data.map((mr: any) => String(mr.rolId ?? mr.id)))
    } catch {
      setMiembroRoles(m.roles ?? [])
    }
  }

  const toggleRol = async (rolId: number, rolNombre: string) => {
    if (!rolesModal) return
    setSavingRol(true)
    try {
      const idStr = String(rolId)
      if (miembroRoles.includes(idStr) || miembroRoles.includes(rolNombre)) {
        await miembroService.quitarRol(rolesModal.idMiembro, rolId)
        setMiembroRoles(prev => prev.filter(r => r !== idStr && r !== rolNombre))
        toast.success(`Rol ${rolNombre} quitado`)
      } else {
        await miembroService.asignarRol(rolesModal.idMiembro, rolId)
        setMiembroRoles(prev => [...prev, idStr])
        toast.success(`Rol ${rolNombre} asignado`)
      }
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setSavingRol(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await miembroService.eliminar(deleteTarget.idMiembro)
      toast.success('Miembro eliminado')
      setDeleteTarget(null)
      load()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setDeleting(false)
    }
  }

  const columns: Column<Miembro>[] = [
    {
      header: 'Miembro',
      render: m => (
        <div>
          <p className="font-medium text-slate-900">{m.nombres} {m.apellidoPaterno} {m.apellidoMaterno}</p>
          <p className="text-xs text-slate-400">{m.email}</p>
        </div>
      ),
    },
    { header: 'DNI', accessor: 'dni' },
    {
      header: 'Roles',
      render: m => (
        <div className="flex flex-wrap gap-1">
          {(m.roles ?? []).map(r => <Badge key={r} label={r} variant="blue" />)}
          {(!m.roles || m.roles.length === 0) && <span className="text-slate-400 text-xs">Sin roles</span>}
        </div>
      ),
    },
    {
      header: 'Estado',
      render: m => <Badge label={m.aprobado ? 'Aprobado' : 'Pendiente'} variant={m.aprobado ? 'green' : 'yellow'} />,
    },
    canManage ? {
      header: 'Acciones',
      className: 'w-28',
      render: m => (
        <div className="flex gap-1">
          <button onClick={() => openRoles(m)} className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all" title="Gestionar roles">
            <Tag className="w-4 h-4" />
          </button>
          <button onClick={() => setDeleteTarget(m)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    } : { header: '', render: () => null },
  ]

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Miembros</h1>
          <p className="text-slate-500 text-sm mt-0.5">Gestión de miembros y sus roles</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
        <Table columns={columns} data={pageData?.content ?? []} loading={loading} rowKey={m => m.idMiembro} />
        {pageData && (
          <div className="px-4">
            <Pagination page={pageData.number} totalPages={pageData.totalPages}
              totalElements={pageData.totalElements} size={pageData.size} onPageChange={setPage} />
          </div>
        )}
      </div>

      {/* Modal roles */}
      {rolesModal && (
        <Modal title={`Roles de ${rolesModal.nombres}`} onClose={() => setRolesModal(null)}>
          <p className="text-sm text-slate-500 mb-4">Haz clic en un rol para asignarlo o quitarlo</p>
          <div className="grid grid-cols-2 gap-2">
            {rolesDisp.map(r => {
              const active = miembroRoles.includes(String(r.id)) || miembroRoles.includes(r.nombre)
              return (
                <button
                  key={r.id}
                  onClick={() => toggleRol(r.id, r.nombre)}
                  disabled={savingRol}
                  className={`px-4 py-3 rounded-xl text-sm font-medium border-2 transition-all ${
                    active
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {r.nombre}
                </button>
              )
            })}
          </div>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Eliminar miembro"
          message={`¿Eliminar a ${deleteTarget.nombres}? Se perderá su acceso al sistema.`}
          confirmLabel="Eliminar"
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </div>
  )
}
