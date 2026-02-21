import { DEPARTAMENTOS, getProvincias, getDistritos } from '../../data/ubigeo'

interface Props {
  departamento: string
  provincia: string
  distrito: string
  onChange: (field: 'departamento' | 'provincia' | 'distrito', value: string) => void
}

const selectClass = 'w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 text-slate-800'

export default function UbigeoSelector({ departamento, provincia, distrito, onChange }: Props) {
  const provincias = getProvincias(departamento)   // Provincia[]
  const distritos  = getDistritos(departamento, provincia)  // string[]

  const handleDepartamento = (dep: string) => {
    onChange('departamento', dep)
    onChange('provincia', '')
    onChange('distrito', '')
  }

  const handleProvincia = (prov: string) => {
    onChange('provincia', prov)
    onChange('distrito', '')
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:col-span-2">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Departamento</label>
        <select value={departamento} onChange={e => handleDepartamento(e.target.value)} className={selectClass}>
          <option value="">— Seleccionar —</option>
          {DEPARTAMENTOS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Provincia</label>
        <select
          value={provincia}
          onChange={e => handleProvincia(e.target.value)}
          disabled={!departamento}
          className={selectClass + (!departamento ? ' opacity-50 cursor-not-allowed' : '')}
        >
          <option value="">— Seleccionar —</option>
          {provincias.map(p => <option key={p.nombre} value={p.nombre}>{p.nombre}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Distrito</label>
        <select
          value={distrito}
          onChange={e => onChange('distrito', e.target.value)}
          disabled={!provincia}
          className={selectClass + (!provincia ? ' opacity-50 cursor-not-allowed' : '')}
        >
          <option value="">— Seleccionar —</option>
          {distritos.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>
    </div>
  )
}
