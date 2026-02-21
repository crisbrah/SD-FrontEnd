import { Link } from 'react-router-dom'
import { Cross, Clock, Mail } from 'lucide-react'

export default function PendingApprovalPage() {
  return (
    <div className="min-h-screen hero-bg flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-primary-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="glass rounded-3xl p-10 shadow-2xl border border-white/20 text-center">
          {/* Icono */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gold-500/20 rounded-full flex items-center justify-center">
                <Clock className="w-10 h-10 text-gold-400" />
              </div>
              <div className="absolute -top-1 -right-1 w-7 h-7 bg-gold-500 rounded-full flex items-center justify-center">
                <Cross className="w-3.5 h-3.5 text-dark-900" />
              </div>
            </div>
          </div>

          <h1 className="font-display text-2xl font-bold text-white mb-3">
            Solicitud enviada
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed mb-2">
            Tu solicitud de acceso fue recibida exitosamente.
          </p>
          <p className="text-slate-400 text-sm leading-relaxed mb-8">
            Un administrador revisará tu información y activará tu cuenta.
            Recibirás acceso una vez aprobado.
          </p>

          {/* Info box */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-8 flex items-start gap-3 text-left">
            <Mail className="w-4 h-4 text-gold-400 mt-0.5 shrink-0" />
            <p className="text-slate-400 text-xs leading-relaxed">
              Cuando tu cuenta sea aprobada, podrás ingresar con el correo y
              contraseña que registraste, o con tu cuenta de Google.
            </p>
          </div>

          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-500
                       text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg
                       hover:shadow-primary-500/30"
          >
            Volver al login
          </Link>

          <div className="mt-4">
            <Link to="/" className="text-slate-500 hover:text-slate-300 transition-colors text-xs">
              ← Ir al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
