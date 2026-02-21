import { useState, useEffect, useCallback } from 'react'
import { Search, Fingerprint, PowerOff } from 'lucide-react'
import { huellaService, personaService } from '../../lib/api'
import type { HuellaPersona, Persona, PageResponse } from '../../types'
import { useAuth } from '../../context/AuthContext'
import Table, { type Column } from '../../components/ui/Table'
import Pagination from '../../components/ui/Pagination'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import Badge from '../../components/ui/Badge'
import ToastContainer from '../../components/ui/Toast'
import { useToast } from '../../hooks/useToast'
import { getErrorMessage } from '../../lib/apiError'

export default function HuellasPage() {
  const { user } = useAuth()
  const toast = useToast()
  const roles = user?.roles ?? []
  const canManage = roles.some(r => ['ENCARGADO','ADMIN','SUPER_ADMIN'].includes(r))

  const [page, setPage] = useState(0)
  const [pageData, setPageData] = useState<PageResponse<HuellaPersona> | null>(null)
  const [loading, setLoading] = useState(true)

  // Búsqueda por persona
  const [searchPersona, setSearchPersona] = useState('')
  const [personas, setPersonas] = useState<Persona[]>([])
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null)
  const [huellasPersona, setHuellasPersona] = useState<HuellaPersona[]>([])

  const [deactivateTarget, setDeactivateTarget] = useState<HuellaPersona | null>(null)
  const [deactivating, setDeactivating] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const r = await huellaService.listar(page)
      setPageData(r.data.data)
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    if (!searchPersona.trim()) { setPersonas([]); return }
    const t = setTimeout(() => {
      personaService.buscarPorNombre(searchPersona).then(r => setPersonas(r.data.data?.content ?? [])).catch(() => {})
    }, 400)
    return () => clearTimeout(t)
  }, [searchPersona])

  const loadHuellasPersona = async (p: Persona) => {
    setSelectedPersona(p)
    try {
      const r = await huellaService.porPersona(p.id)
      setHuellasPersona(r.data.data ?? [])
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  const handleDesactivar = async () => {
    if (!deactivateTarget) return
    setDeactivating(true)
    try {
      await huellaService.desactivar(deactivateTarget.id)
      toast.success('Huella desactivada')
      setDeactivateTarget(null)
      if (selectedPersona) loadHuellasPersona(selectedPersona)
      else load()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setDeactivating(false)
    }
  }

  const columns: Column<HuellaPersona>[] = [
    {
      header: 'Persona',
      render: h => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
            <Fingerprint className="w-4 h-4 text-primary-600" />
          </div>
          <p className="font-medium text-slate-900">{h.personaNombres}</p>
        </div>
      ),
    },
    { header: 'Dedo', render: h => <span className="text-sm">{h.dedo.replace('_', ' ')}</span> },
    {
      header: 'Registrado',
      render: h => <span className="text-sm text-slate-500">{h.registradoEn ? new Date(h.registradoEn).toLocaleDateString('es-PE') : '—'}</span>,
    },
    { header: 'Estado', render: h => <Badge label={h.activo ? 'Activo' : 'Inactivo'} variant={h.activo ? 'green' : 'red'} /> },
    canManage ? {
      header: 'Acciones', className: 'w-24',
      render: h => h.activo ? (
        <button onClick={() => setDeactivateTarget(h)}
          className="flex items-center gap-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-medium transition-all">
          <PowerOff className="w-3.5 h-3.5" />Desactivar
        </button>
      ) : null,
    } : { header: '', render: () => null },
  ]

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Huellas Dactilares</h1>
          <p className="text-slate-500 text-sm mt-0.5">Gestión de huellas biométricas</p>
        </div>
      </div>

      {/* Buscar huellas por persona */}
      <div className="mb-4 bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        <p className="text-sm font-medium text-slate-700 mb-3">Buscar huellas por persona</p>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Nombre de persona..."
            value={searchPersona}
            onChange={e => { setSearchPersona(e.target.value); setSelectedPersona(null) }}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
          />
        </div>
        {personas.length > 0 && !selectedPersona && (
          <div className="mt-2 max-h-40 overflow-y-auto rounded-xl border border-slate-200 divide-y">
            {personas.map(p => (
              <button key={p.id} onClick={() => { loadHuellasPersona(p); setSearchPersona(p.nombres + ' ' + p.apellidoPaterno); setPersonas([]) }}
                className="w-full text-left px-4 py-2.5 hover:bg-primary-50 transition-all text-sm">
                {p.nombres} {p.apellidoPaterno} — DNI: {p.dni}
              </button>
            ))}
          </div>
        )}
        {selectedPersona && (
          <div className="mt-3">
            <p className="text-xs font-semibold text-slate-500 mb-2">Huellas de {selectedPersona.nombres} {selectedPersona.apellidoPaterno}</p>
            {huellasPersona.length === 0 ? (
              <p className="text-slate-400 text-sm py-2">Sin huellas registradas</p>
            ) : (
              <div className="space-y-2">
                {huellasPersona.map(h => (
                  <div key={h.id} className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <Fingerprint className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-medium">{h.dedo.replace('_', ' ')}</span>
                      <Badge label={h.activo ? 'Activo' : 'Inactivo'} variant={h.activo ? 'green' : 'red'} />
                    </div>
                    {canManage && h.activo && (
                      <button onClick={() => setDeactivateTarget(h)}
                        className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1">
                        <PowerOff className="w-3.5 h-3.5" />Desactivar
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tabla general */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
        <div className="px-4 py-3 border-b border-slate-100">
          <p className="font-semibold text-slate-800">Todas las huellas</p>
        </div>
        <Table columns={columns} data={pageData?.content ?? []} loading={loading} rowKey={h => h.id}
          emptyMessage="Sin huellas registradas" />
        {pageData && (
          <div className="px-4">
            <Pagination page={pageData.number} totalPages={pageData.totalPages}
              totalElements={pageData.totalElements} size={pageData.size} onPageChange={setPage} />
          </div>
        )}
      </div>

      {deactivateTarget && (
        <ConfirmDialog
          title="Desactivar huella"
          message={`¿Desactivar la huella ${deactivateTarget.dedo.replace('_', ' ')} de ${deactivateTarget.personaNombres}?`}
          confirmLabel="Desactivar"
          variant="warning"
          onConfirm={handleDesactivar}
          onCancel={() => setDeactivateTarget(null)}
          loading={deactivating}
        />
      )}
    </div>
  )
}
