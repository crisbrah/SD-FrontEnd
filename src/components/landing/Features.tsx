import { Users, Calendar, BookOpen, ClipboardList, Fingerprint, QrCode } from 'lucide-react'

const features = [
  {
    icon: Users,
    title: 'Gestión de Personas',
    description: 'Registro completo de miembros, visitantes y roles dentro de la congregación.',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: Calendar,
    title: 'Sesiones de Culto',
    description: 'Abre y cierra sesiones para cada servicio: dominical, oración, jóvenes y más.',
    color: 'from-purple-500 to-purple-600',
  },
  {
    icon: ClipboardList,
    title: 'Control de Asistencia',
    description: 'Registra asistencia por código de barras (DNI), lector de huella o de forma manual.',
    color: 'from-emerald-500 to-emerald-600',
  },
  {
    icon: BookOpen,
    title: 'Cursos y Formación',
    description: 'Gestiona cursos, inscripciones y asistencias a clases de educación eclesiástica.',
    color: 'from-amber-500 to-amber-600',
  },
  {
    icon: Fingerprint,
    title: 'Huella Dactilar',
    description: 'Integración con lector biométrico para identificación rápida y segura de asistentes.',
    color: 'from-rose-500 to-rose-600',
  },
  {
    icon: QrCode,
    title: 'Código de Barras / QR',
    description: 'Escanea el carnet (DNI) para registrar asistencia en segundos sin errores manuales.',
    color: 'from-cyan-500 to-cyan-600',
  },
]

export default function Features() {
  return (
    <section id="features" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-primary-600 font-semibold text-sm uppercase tracking-widest mb-3">
            Módulos del sistema
          </p>
          <h2 className="font-display text-4xl font-bold text-slate-900 mb-4">
            Todo lo que necesitas, en un solo lugar
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Diseñado específicamente para iglesias que buscan eficiencia,
            transparencia y crecimiento organizacional.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, description, color }) => (
            <div key={title} className="card p-6 group cursor-default">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-slate-900 text-lg mb-2">{title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
