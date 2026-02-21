import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Cross, Menu, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const { isAuthenticated, logout } = useAuth()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isLanding = location.pathname === '/'

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled || !isLanding
          ? 'bg-dark-950/95 backdrop-blur-md shadow-lg border-b border-white/10'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gold-500 rounded-lg flex items-center justify-center shadow-lg group-hover:bg-gold-400 transition-colors">
              <Cross className="w-4 h-4 text-dark-900" />
            </div>
            <span className="font-display text-white font-semibold text-lg tracking-wide">
              Sanidad Divina
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {isLanding && (
              <>
                <a href="#features" className="text-slate-300 hover:text-white text-sm transition-colors">
                  Módulos
                </a>
                <a href="#about" className="text-slate-300 hover:text-white text-sm transition-colors">
                  Acerca de
                </a>
              </>
            )}

            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-slate-300 hover:text-white text-sm transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm text-slate-300 hover:text-white border border-white/20 rounded-lg hover:bg-white/10 transition-all"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm text-slate-300 hover:text-white border border-white/20 rounded-lg hover:bg-white/10 transition-all"
                >
                  Registrarse
                </Link>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm bg-primary-600 hover:bg-primary-500 text-white rounded-lg font-medium transition-all hover:shadow-lg hover:shadow-primary-500/25"
                >
                  Iniciar sesión
                </Link>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-white p-1"
            onClick={() => setMenuOpen(v => !v)}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-dark-950/98 border-t border-white/10 px-4 pb-4 pt-2 space-y-2">
          {isLanding && (
            <>
              <a href="#features" className="block text-slate-300 py-2 text-sm" onClick={() => setMenuOpen(false)}>
                Módulos
              </a>
              <a href="#about" className="block text-slate-300 py-2 text-sm" onClick={() => setMenuOpen(false)}>
                Acerca de
              </a>
            </>
          )}
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="block text-slate-300 py-2 text-sm" onClick={() => setMenuOpen(false)}>
                Dashboard
              </Link>
              <button onClick={() => { logout(); setMenuOpen(false) }} className="block text-slate-300 py-2 text-sm">
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/register" className="block text-center py-2 border border-white/20 text-slate-300 rounded-lg text-sm font-medium" onClick={() => setMenuOpen(false)}>
                Registrarse
              </Link>
              <Link to="/login" className="block text-center py-2 bg-primary-600 text-white rounded-lg text-sm font-medium" onClick={() => setMenuOpen(false)}>
                Iniciar sesión
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
