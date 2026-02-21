import { useState, useEffect } from 'react'
import { BarChart2, TrendingUp, TrendingDown, Users, Lock, GraduationCap, Printer, CheckCircle, XCircle, Clock } from 'lucide-react'
import { reporteService, cursoService } from '../../lib/api'
import type { ReporteFinanciero, ReporteAsistencia, Curso, CursoPersona } from '../../types'
import { useAuth } from '../../context/AuthContext'
import ToastContainer from '../../components/ui/Toast'
import { useToast } from '../../hooks/useToast'
import { getErrorMessage } from '../../lib/apiError'

const now = new Date()
const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

export default function ReportesPage() {
  const { user } = useAuth()
  const toast = useToast()
  const roles = user?.roles ?? []
  const canFinanciero = roles.some(r => ['TESORERO','ADMIN','SUPER_ADMIN'].includes(r))
  const canAsistencia = roles.some(r => ['ENCARGADO','MAESTRO','ADMIN','SUPER_ADMIN'].includes(r))
  const canDiplomas   = roles.some(r => ['MAESTRO','ADMIN','SUPER_ADMIN'].includes(r))

  // ── Reporte Financiero ──────────────────────────────────────────────────────
  const [mes, setMes] = useState(now.getMonth() + 1)
  const [anio, setAnio] = useState(now.getFullYear())
  const [repFin, setRepFin] = useState<ReporteFinanciero | null>(null)
  const [loadingFin, setLoadingFin] = useState(false)

  // ── Reporte Asistencia ──────────────────────────────────────────────────────
  const [desde, setDesde] = useState('')
  const [hasta, setHasta] = useState('')
  const [repAsis, setRepAsis] = useState<ReporteAsistencia | null>(null)
  const [loadingAsis, setLoadingAsis] = useState(false)

  // ── Reporte Notas / Diplomas ────────────────────────────────────────────────
  const [cursos, setCursos] = useState<Curso[]>([])
  const [cursoId, setCursoId] = useState<number | ''>('')
  const [inscripciones, setInscripciones] = useState<CursoPersona[]>([])
  const [loadingNotas, setLoadingNotas] = useState(false)
  const [generado, setGenerado] = useState(false)

  useEffect(() => {
    if (!canDiplomas) return
    cursoService.listar(0, 100)
      .then(r => setCursos(r.data.data?.content ?? []))
      .catch(() => {})
  }, [canDiplomas])

  // ── Actions ─────────────────────────────────────────────────────────────────
  const cargarFinanciero = async () => {
    setLoadingFin(true)
    try {
      const r = await reporteService.financiero(mes, anio)
      setRepFin(r.data.data)
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoadingFin(false)
    }
  }

  const cargarAsistencia = async () => {
    if (!desde || !hasta) { toast.error('Selecciona rango de fechas'); return }
    setLoadingAsis(true)
    try {
      const r = await reporteService.asistenciaPorRango(desde, hasta)
      setRepAsis(r.data.data)
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoadingAsis(false)
    }
  }

  const cargarNotas = async () => {
    if (!cursoId) { toast.error('Selecciona un curso'); return }
    setLoadingNotas(true)
    setGenerado(false)
    try {
      const r = await cursoService.inscripciones(Number(cursoId))
      setInscripciones(r.data.data ?? [])
      setGenerado(true)
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoadingNotas(false)
    }
  }

  const cursosSeleccionado = cursos.find(c => c.id === Number(cursoId))

  const imprimirDiplomas = () => {
    const el = document.getElementById('diploma-print-area')
    if (!el) return
    const originalBody = document.body.innerHTML
    document.body.innerHTML = el.outerHTML
    window.print()
    document.body.innerHTML = originalBody
    window.location.reload()
  }

  const aprobados = inscripciones.filter(i => i.activo && (i.nota ?? 0) >= 11)
  const reprobados = inscripciones.filter(i => i.activo && (i.nota ?? 0) > 0 && (i.nota ?? 0) < 11)
  const sinNota = inscripciones.filter(i => i.activo && !i.nota)

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Reportes</h1>
        <p className="text-slate-500 text-sm mt-0.5">Análisis financiero, asistencia y notas de cursos</p>
      </div>

      {/* Fila 1: Financiero + Asistencia */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Reporte Financiero */}
        {canFinanciero ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <BarChart2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-900">Reporte Financiero</h2>
                <p className="text-xs text-slate-400">Ingresos vs Egresos por mes</p>
              </div>
            </div>

            <div className="flex gap-3 mb-4">
              <select value={mes} onChange={e => setMes(Number(e.target.value))}
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300">
                {MESES.map((m, i) => <option key={i+1} value={i+1}>{m}</option>)}
              </select>
              <input type="number" value={anio} onChange={e => setAnio(Number(e.target.value))}
                min="2020" max="2099"
                className="w-24 px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
            </div>

            <button onClick={cargarFinanciero} disabled={loadingFin}
              className="w-full px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-medium transition-all disabled:opacity-60 mb-4">
              {loadingFin ? 'Cargando...' : 'Generar reporte'}
            </button>

            {repFin && (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-emerald-50 rounded-xl p-3 text-center">
                    <div className="flex items-center justify-center gap-1 text-emerald-600 mb-1">
                      <TrendingUp className="w-4 h-4" /><span className="text-xs font-medium">Ingresos</span>
                    </div>
                    <p className="text-lg font-bold text-emerald-700">S/ {repFin.totalIngresos?.toFixed(2) ?? '0.00'}</p>
                  </div>
                  <div className="bg-red-50 rounded-xl p-3 text-center">
                    <div className="flex items-center justify-center gap-1 text-red-500 mb-1">
                      <TrendingDown className="w-4 h-4" /><span className="text-xs font-medium">Egresos</span>
                    </div>
                    <p className="text-lg font-bold text-red-600">S/ {repFin.totalEgresos?.toFixed(2) ?? '0.00'}</p>
                  </div>
                  <div className={`rounded-xl p-3 text-center ${(repFin.balance ?? 0) >= 0 ? 'bg-blue-50' : 'bg-amber-50'}`}>
                    <p className="text-xs font-medium text-slate-500 mb-1">Balance</p>
                    <p className={`text-lg font-bold ${(repFin.balance ?? 0) >= 0 ? 'text-blue-700' : 'text-amber-700'}`}>
                      S/ {repFin.balance?.toFixed(2) ?? '0.00'}
                    </p>
                  </div>
                </div>
                {repFin.ingresosPorTipo && Object.keys(repFin.ingresosPorTipo).length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-slate-500 mb-2">Ingresos por tipo</p>
                    {Object.entries(repFin.ingresosPorTipo).map(([tipo, monto]) => (
                      <div key={tipo} className="flex justify-between text-sm py-1 border-b border-slate-100 last:border-0">
                        <span className="text-slate-600">{tipo}</span>
                        <span className="font-medium text-emerald-700">S/ {(monto as number).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                )}
                {repFin.egresosPorTipo && Object.keys(repFin.egresosPorTipo).length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-slate-500 mb-2">Egresos por tipo</p>
                    {Object.entries(repFin.egresosPorTipo).map(([tipo, monto]) => (
                      <div key={tipo} className="flex justify-between text-sm py-1 border-b border-slate-100 last:border-0">
                        <span className="text-slate-600">{tipo}</span>
                        <span className="font-medium text-red-600">S/ {(monto as number).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 flex flex-col items-center justify-center gap-3 text-center min-h-[200px]">
            <Lock className="w-8 h-8 text-slate-300" />
            <p className="text-slate-400 text-sm">Reporte financiero disponible solo para Tesorero y Administradores</p>
          </div>
        )}

        {/* Reporte Asistencia */}
        {canAsistencia ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-900">Reporte de Asistencia</h2>
                <p className="text-xs text-slate-400">Por rango de fechas</p>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Desde</label>
                <input type="date" value={desde} onChange={e => setDesde(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Hasta</label>
                <input type="date" value={hasta} onChange={e => setHasta(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
              </div>
            </div>

            <button onClick={cargarAsistencia} disabled={loadingAsis}
              className="w-full px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-medium transition-all disabled:opacity-60 mb-4">
              {loadingAsis ? 'Cargando...' : 'Generar reporte'}
            </button>

            {repAsis && (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-blue-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-blue-500 mb-1">Sesiones</p>
                    <p className="text-2xl font-bold text-blue-700">{repAsis.totalSesiones}</p>
                  </div>
                  <div className="bg-primary-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-primary-500 mb-1">Asistencias</p>
                    <p className="text-2xl font-bold text-primary-700">{repAsis.totalAsistencias}</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-slate-500 mb-1">Promedio</p>
                    <p className="text-2xl font-bold text-slate-700">{repAsis.promedioPorSesion?.toFixed(1)}</p>
                  </div>
                </div>
                {repAsis.detalles && repAsis.detalles.length > 0 && (
                  <div className="max-h-48 overflow-y-auto">
                    <p className="text-xs font-semibold text-slate-500 mb-2">Detalle por sesión</p>
                    {repAsis.detalles.map(d => (
                      <div key={d.sesionId} className="flex justify-between text-sm py-1 border-b border-slate-100 last:border-0">
                        <span className="text-slate-600 truncate">{d.sesionNombre}</span>
                        <span className="font-medium text-primary-600 shrink-0 ml-2">{d.total}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 flex flex-col items-center justify-center gap-3 text-center min-h-[200px]">
            <Lock className="w-8 h-8 text-slate-300" />
            <p className="text-slate-400 text-sm">Reporte de asistencia disponible para Encargados y Administradores</p>
          </div>
        )}
      </div>

      {/* Fila 2: Notas y Diplomas (ancho completo) */}
      {canDiplomas ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-900">Notas y Diplomas</h2>
                <p className="text-xs text-slate-400">Calificaciones por curso — formato para diploma de aprobación</p>
              </div>
            </div>
            {generado && inscripciones.length > 0 && (
              <button
                onClick={imprimirDiplomas}
                className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-medium transition-all"
              >
                <Printer className="w-4 h-4" /> Imprimir diplomas
              </button>
            )}
          </div>

          {/* Selector de curso */}
          <div className="flex gap-3 mb-4">
            <select
              value={cursoId}
              onChange={e => { setCursoId(e.target.value ? Number(e.target.value) : ''); setGenerado(false); setInscripciones([]) }}
              className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
            >
              <option value="">— Seleccionar curso —</option>
              {cursos.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
            <button
              onClick={cargarNotas}
              disabled={!cursoId || loadingNotas}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-medium transition-all disabled:opacity-50"
            >
              {loadingNotas ? 'Cargando...' : 'Generar'}
            </button>
          </div>

          {/* Tabla de notas */}
          {generado && (
            <>
              {/* Resumen estadístico */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-emerald-50 rounded-xl p-3 flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-emerald-500 shrink-0" />
                  <div>
                    <p className="text-xs text-emerald-600">Aprobados</p>
                    <p className="text-xl font-bold text-emerald-700">{aprobados.length}</p>
                  </div>
                </div>
                <div className="bg-red-50 rounded-xl p-3 flex items-center gap-3">
                  <XCircle className="w-6 h-6 text-red-400 shrink-0" />
                  <div>
                    <p className="text-xs text-red-500">Reprobados</p>
                    <p className="text-xl font-bold text-red-600">{reprobados.length}</p>
                  </div>
                </div>
                <div className="bg-amber-50 rounded-xl p-3 flex items-center gap-3">
                  <Clock className="w-6 h-6 text-amber-400 shrink-0" />
                  <div>
                    <p className="text-xs text-amber-600">Sin nota</p>
                    <p className="text-xl font-bold text-amber-600">{sinNota.length}</p>
                  </div>
                </div>
              </div>

              {inscripciones.length === 0 ? (
                <p className="text-center py-8 text-slate-400 text-sm">Sin estudiantes inscritos en este curso.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-2 px-3 font-semibold text-slate-600">#</th>
                        <th className="text-left py-2 px-3 font-semibold text-slate-600">Estudiante</th>
                        <th className="text-center py-2 px-3 font-semibold text-slate-600">Asistencias</th>
                        <th className="text-center py-2 px-3 font-semibold text-slate-600">Nota</th>
                        <th className="text-center py-2 px-3 font-semibold text-slate-600">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inscripciones.filter(i => i.activo).map((ins, idx) => {
                        const nota = ins.nota ?? null
                        const aprobado = nota !== null && nota >= 11
                        const reprobado = nota !== null && nota < 11
                        return (
                          <tr key={ins.personaId} className="border-b border-slate-100 hover:bg-slate-50">
                            <td className="py-2.5 px-3 text-slate-400">{idx + 1}</td>
                            <td className="py-2.5 px-3 font-medium text-slate-900">{ins.personaNombres}</td>
                            <td className="py-2.5 px-3 text-center text-slate-600">{ins.asistencias ?? '—'}</td>
                            <td className="py-2.5 px-3 text-center">
                              <span className={`font-bold text-base ${aprobado ? 'text-emerald-600' : reprobado ? 'text-red-500' : 'text-slate-400'}`}>
                                {nota !== null ? nota.toFixed(1) : '—'}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              {aprobado && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                                  <CheckCircle className="w-3 h-3" /> Aprobado
                                </span>
                              )}
                              {reprobado && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-600">
                                  <XCircle className="w-3 h-3" /> Reprobado
                                </span>
                              )}
                              {nota === null && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-600">
                                  <Clock className="w-3 h-3" /> Pendiente
                                </span>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {/* Área de impresión (oculta en pantalla) */}
          {generado && cursosSeleccionado && (
            <div id="diploma-print-area" style={{ display: 'none' }}>
              <style>{`
                @page { margin: 2cm; }
                body { font-family: serif; }
                .diploma-header { text-align: center; border-bottom: 3px double #1e3a5f; padding-bottom: 20px; margin-bottom: 30px; }
                .diploma-header h1 { font-size: 28px; color: #1e3a5f; margin: 0 0 4px; }
                .diploma-header p { font-size: 13px; color: #555; margin: 0; }
                .diploma-title { text-align: center; margin-bottom: 30px; }
                .diploma-title h2 { font-size: 22px; color: #1e3a5f; }
                table { width: 100%; border-collapse: collapse; font-size: 13px; }
                th { background: #1e3a5f; color: white; padding: 8px 12px; text-align: left; }
                td { padding: 7px 12px; border-bottom: 1px solid #ddd; }
                tr:nth-child(even) td { background: #f5f7fa; }
                .aprobado { color: #16a34a; font-weight: bold; }
                .reprobado { color: #dc2626; font-weight: bold; }
                .footer { text-align: center; margin-top: 40px; font-size: 12px; color: #888; }
              `}</style>
              <div className="diploma-header">
                <h1>Iglesia Sanidad Divina</h1>
                <p>Sistema de Gestión Académica</p>
              </div>
              <div className="diploma-title">
                <h2>Reporte de Notas — {cursosSeleccionado.nombre}</h2>
                <p style={{ color: '#555', fontSize: '13px' }}>
                  Fecha: {new Date().toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' })}
                  {' · '}Aprobados: {aprobados.length} / {inscripciones.filter(i => i.activo).length}
                </p>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Nombre del Estudiante</th>
                    <th>Asistencias</th>
                    <th>Nota Final</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {inscripciones.filter(i => i.activo).map((ins, idx) => {
                    const nota = ins.nota ?? null
                    const aprobado = nota !== null && nota >= 11
                    return (
                      <tr key={ins.personaId}>
                        <td>{idx + 1}</td>
                        <td>{ins.personaNombres}</td>
                        <td>{ins.asistencias ?? '—'}</td>
                        <td>{nota !== null ? nota.toFixed(1) : '—'}</td>
                        <td className={aprobado ? 'aprobado' : nota !== null ? 'reprobado' : ''}>
                          {aprobado ? 'APROBADO' : nota !== null ? 'REPROBADO' : 'PENDIENTE'}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              <div className="footer">
                <p>Este documento es generado automáticamente por el sistema de Sanidad Divina.</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 flex flex-col items-center justify-center gap-3 text-center">
          <Lock className="w-8 h-8 text-slate-300" />
          <p className="text-slate-400 text-sm">Reporte de notas disponible para Maestros y Administradores</p>
        </div>
      )}
    </div>
  )
}
