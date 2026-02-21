import { useState, useEffect } from 'react'
import { User, Save, Info } from 'lucide-react'
import { personaService } from '../../lib/api'
import type { ActualizarPersonaForm } from '../../types'
import { useAuth } from '../../context/AuthContext'
import UbigeoSelector from '../../components/ui/UbigeoSelector'
import ToastContainer from '../../components/ui/Toast'
import { useToast } from '../../hooks/useToast'
import { getErrorMessage } from '../../lib/apiError'

const EMPTY: ActualizarPersonaForm = {
  celular: '', fechaBautizo: '', lugarNacimiento: '', estadoCivil: '',
  numeroHijos: undefined, ocupacion: '', direccion: '',
  distrito: '', provincia: '', departamento: '',
  cargo: undefined, iglesiaProcedenciaId: undefined,
}

export default function MiPerfilPage() {
  const { user } = useAuth()
  const toast = useToast()

  const [persona, setPersona] = useState<any>(null)
  const [form, setForm] = useState<ActualizarPersonaForm>(EMPTY)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!user?.personaId) return
    personaService.buscarPorId(user.personaId)
      .then(r => {
        const p = r.data.data
        setPersona(p)
        setForm({
          celular: p.celular ?? '',
          fechaBautizo: p.fechaBautizo ?? '',
          lugarNacimiento: p.lugarNacimiento ?? '',
          estadoCivil: p.estadoCivil ?? '',
          numeroHijos: p.numeroHijos,
          ocupacion: p.ocupacion ?? '',
          direccion: p.direccion ?? '',
          distrito: p.distrito ?? '',
          provincia: p.provincia ?? '',
          departamento: p.departamento ?? '',
          cargo: p.cargo,
          iglesiaProcedenciaId: p.iglesiaProcedenciaId,
        })
      })
      .catch(err => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [user?.personaId])

  const handleSave = async () => {
    if (!user?.personaId) return
    setSaving(true)
    try {
      await personaService.actualizar(user.personaId, form)
      toast.success('Perfil actualizado correctamente')
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  const inputCls = 'w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white'
  const readCls  = 'w-full px-3 py-2 rounded-xl border border-slate-100 bg-slate-50 text-sm text-slate-500'

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />

      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-2xl bg-primary-100 flex items-center justify-center">
          <User className="w-7 h-7 text-primary-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mi Perfil</h1>
          <p className="text-slate-500 text-sm">Edita tu información personal</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : !persona ? (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-700 text-sm flex items-start gap-2">
          <Info className="w-4 h-4 shrink-0 mt-0.5" />
          <p>Tu cuenta aún no tiene una persona asociada. Contacta a un administrador.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          {/* Datos de solo lectura (vienen de RENIEC) */}
          <div className="mb-5 pb-5 border-b border-slate-100">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Datos registrados</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Nombres</label>
                <div className={readCls}>{persona.nombres}</div>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Apellidos</label>
                <div className={readCls}>{persona.apellidoPaterno} {persona.apellidoMaterno}</div>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">DNI</label>
                <div className={readCls}>{persona.dni}</div>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Fecha de nacimiento</label>
                <div className={readCls}>{persona.fechaNacimiento}</div>
              </div>
            </div>
          </div>

          {/* Campos editables */}
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Información editable</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Celular</label>
              <input type="tel" value={form.celular ?? ''}
                onChange={e => setForm(p => ({ ...p, celular: e.target.value }))}
                placeholder="999 999 999"
                className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Estado Civil</label>
              <select value={form.estadoCivil ?? ''}
                onChange={e => setForm(p => ({ ...p, estadoCivil: e.target.value }))}
                className={inputCls}>
                <option value="">—</option>
                {['Soltero/a','Casado/a','Viudo/a','Divorciado/a'].map(ec => <option key={ec} value={ec}>{ec}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Ocupación</label>
              <input type="text" value={form.ocupacion ?? ''}
                onChange={e => setForm(p => ({ ...p, ocupacion: e.target.value }))}
                className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Número de Hijos</label>
              <input type="number" min="0" value={form.numeroHijos ?? ''}
                onChange={e => setForm(p => ({ ...p, numeroHijos: e.target.value ? Number(e.target.value) : undefined }))}
                className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Fecha de Bautizo</label>
              <input type="date" value={form.fechaBautizo ?? ''}
                onChange={e => setForm(p => ({ ...p, fechaBautizo: e.target.value }))}
                className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Lugar de Nacimiento</label>
              <input type="text" value={form.lugarNacimiento ?? ''}
                onChange={e => setForm(p => ({ ...p, lugarNacimiento: e.target.value }))}
                className={inputCls} />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Dirección</label>
              <input type="text" value={form.direccion ?? ''}
                onChange={e => setForm(p => ({ ...p, direccion: e.target.value }))}
                placeholder="Calle, número, referencia"
                className={inputCls} />
            </div>
            <UbigeoSelector
              departamento={form.departamento ?? ''}
              provincia={form.provincia ?? ''}
              distrito={form.distrito ?? ''}
              onChange={(field, value) => setForm(p => ({ ...p, [field]: value }))}
            />
          </div>

          <div className="mt-6 flex justify-end">
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-medium transition-all disabled:opacity-60">
              <Save className="w-4 h-4" />
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
