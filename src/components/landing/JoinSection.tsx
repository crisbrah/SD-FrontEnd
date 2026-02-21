import { Link } from 'react-router-dom'
import { UserPlus } from 'lucide-react'

export default function JoinSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-dark-950 via-primary-950 to-dark-900 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl" />
        {/* Cross watermark */}
        <div className="absolute inset-0 flex items-center justify-end pr-12 opacity-[0.04]">
          <svg viewBox="0 0 100 120" className="w-72 fill-white">
            <rect x="42" y="0" width="16" height="120" />
            <rect x="0" y="35" width="100" height="16" />
          </svg>
        </div>
      </div>

      <div className="relative max-w-3xl mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/20 text-gold-400 text-sm font-medium mb-8 border border-gold-500/20">
          ✝ Únete a nuestra familia
        </div>

        <h2 className="text-4xl sm:text-5xl font-bold text-white font-display leading-tight mb-6">
          Hay un lugar para ti en{' '}
          <span className="gradient-text">Sanidad Divina</span>
        </h2>

        <p className="text-slate-300 text-lg mb-10 leading-relaxed">
          No importa tu historia, tu pasado o tus preguntas. En esta iglesia encontrarás
          amor, gracia y una comunidad que camina contigo hacia el propósito de Dios.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/register" className="btn-gold text-base">
            <UserPlus className="w-5 h-5" />
            Solicitar membresía
          </Link>
          <Link to="/login" className="btn-outline text-base">
            Ya tengo cuenta — Ingresar
          </Link>
        </div>

        <p className="mt-8 text-slate-500 text-sm">
          Tu solicitud será revisada por nuestros líderes. Recibirás confirmación pronto.
        </p>
      </div>
    </section>
  )
}
