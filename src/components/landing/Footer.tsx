import { Cross } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-dark-950 text-slate-400 py-16 border-t border-white/10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-gold-500 rounded-xl flex items-center justify-center">
                <Cross className="w-4.5 h-4.5 text-dark-900" />
              </div>
              <div>
                <p className="text-white font-bold font-display text-lg">Sanidad Divina</p>
                <p className="text-slate-500 text-xs">Iglesia Evangélica</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed">
              Una comunidad de fe donde el poder de Dios sana, restaura y transforma vidas para su gloria.
            </p>
            <p className="mt-4 text-gold-400/80 italic text-sm">"Mas buscad primeramente el reino de Dios..." — Mt 6:33</p>
          </div>

          {/* Links */}
          <div>
            <p className="text-white font-semibold mb-4 text-sm uppercase tracking-widest">Navegación</p>
            <div className="space-y-2.5 text-sm">
              <a href="#vision" className="block hover:text-white transition-colors">Misión y Visión</a>
              <a href="#ministerios" className="block hover:text-white transition-colors">Ministerios</a>
              <a href="#features" className="block hover:text-white transition-colors">Sistema</a>
              <Link to="/register" className="block text-gold-400/80 hover:text-gold-400 transition-colors">Solicitar membresía</Link>
              <Link to="/login" className="block hover:text-white transition-colors">Ingresar al sistema</Link>
            </div>
          </div>

          {/* Contacto */}
          <div>
            <p className="text-white font-semibold mb-4 text-sm uppercase tracking-widest">Comunidad</p>
            <div className="space-y-2.5 text-sm">
              <div className="flex items-center gap-2">
                <span>📍</span>
                <span>Perú</span>
              </div>
              <div className="flex items-center gap-2">
                <span>⛪</span>
                <span>Cultos Domingos y Miércoles</span>
              </div>
              <div className="flex items-center gap-2">
                <span>✉️</span>
                <span>sanidaddivina@iglesia.pe</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-sm">
            © {new Date().getFullYear()} Iglesia Sanidad Divina. Todos los derechos reservados.
          </p>
          <p className="text-slate-600 text-xs">
            Sistema de Gestión Integral
          </p>
        </div>
      </div>
    </footer>
  )
}
