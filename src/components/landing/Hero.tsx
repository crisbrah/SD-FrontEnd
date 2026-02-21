import { Link } from 'react-router-dom'
import { ArrowRight, UserPlus, BookOpen } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function Hero() {
  const { isAuthenticated } = useAuth()

  return (
    <section className="hero-bg min-h-screen flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
      {/* Background — subtle cross watermark */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl" />
        {/* Cross watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03]">
          <svg viewBox="0 0 100 120" className="w-[40vw] max-w-xl fill-white">
            <rect x="42" y="0" width="16" height="120" />
            <rect x="0" y="35" width="100" height="16" />
          </svg>
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Versículo badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass text-gold-300 text-sm font-medium mb-8 border border-gold-500/20">
          <span className="text-gold-400">✝</span>
          <span className="italic">"Mas buscad primeramente el reino de Dios..."</span>
          <span className="text-gold-500/60 not-italic">Mateo 6:33</span>
        </div>

        {/* Title */}
        <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
          Iglesia{' '}
          <span className="gradient-text">Sanidad Divina</span>
        </h1>

        <p className="text-slate-300 text-lg sm:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
          Una comunidad de fe donde el amor de Dios transforma vidas. Únete a nuestra familia y
          crecer juntos en la fe, comunidad y servicio.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn-primary text-base">
              Ir al Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn-primary text-base">
                Ingresar al Sistema <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/register" className="btn-gold text-base">
                <UserPlus className="w-4 h-4" />
                Únete a nosotros
              </Link>
              <a href="#vision" className="btn-outline text-base">
                <BookOpen className="w-4 h-4" />
                Conoce la iglesia
              </a>
            </>
          )}
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-3 gap-8 max-w-lg mx-auto">
          {[
            { emoji: '✝', label: 'Fe', value: 'Fundados en Cristo' },
            { emoji: '🤝', label: 'Comunidad', value: 'Familia de Dios' },
            { emoji: '🕊️', label: 'Servicio', value: 'Sirviendo al prójimo' },
          ].map(({ emoji, label, value }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center text-2xl">
                {emoji}
              </div>
              <p className="text-white text-xs font-semibold">{label}</p>
              <p className="text-slate-400 text-xs">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <div className="w-px h-8 bg-gradient-to-b from-transparent to-slate-400" />
        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
      </div>
    </section>
  )
}
