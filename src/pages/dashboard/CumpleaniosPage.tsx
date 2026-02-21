import { useState, useEffect } from 'react'
import { Gift, AlertCircle } from 'lucide-react'
import { personaService } from '../../lib/api'
import type { Persona } from '../../types'
import { getErrorMessage } from '../../lib/apiError'

const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

export default function CumpleaniosPage() {
  const [personas, setPersonas] = useState<Persona[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mes, setMes] = useState(new Date().getMonth() + 1)

  useEffect(() => {
    setLoading(true)
    setError(null)
    personaService.cumpleanios(mes)
      .then(r => setPersonas(r.data.data ?? []))
      .catch(err => { setPersonas([]); setError(getErrorMessage(err)) })
      .finally(() => setLoading(false))
  }, [mes])

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Cumpleaños</h1>
          <p className="text-slate-500 text-sm mt-0.5">Celebremos juntos a nuestros hermanos</p>
        </div>
        <select
          value={mes}
          onChange={e => setMes(Number(e.target.value))}
          className="px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white"
        >
          {MESES.map((m, i) => <option key={i+1} value={i+1}>{m}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-red-400">
          <AlertCircle className="w-12 h-12" />
          <p>{error}</p>
        </div>
      ) : personas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
          <Gift className="w-12 h-12" />
          <p>Sin cumpleaños en {MESES[mes - 1]}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {personas.map(p => {
            const fecha = p.fechaNacimiento
              ? new Date(p.fechaNacimiento + 'T00:00:00')
              : null
            const dia = fecha ? fecha.getDate() : '?'
            return (
              <div key={p.id} className="flex items-center gap-4 bg-white rounded-2xl border border-slate-100 shadow-sm px-5 py-4">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-xl shrink-0">
                  🎂
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900">
                    {p.nombres} {p.apellidoPaterno} {p.apellidoMaterno}
                  </p>
                  {p.cargo && (
                    <p className="text-xs text-slate-400">{p.cargo.replace('_',' ')}</p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="text-2xl font-bold text-amber-500">{dia}</p>
                  <p className="text-xs text-slate-400">{MESES[mes - 1]}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
