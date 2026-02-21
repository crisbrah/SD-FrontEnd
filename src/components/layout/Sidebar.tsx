import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Users, UserCheck, Calendar, ClipboardList,
  BookOpen, GraduationCap, Church, Circle, MapPin, Globe,
  TrendingUp, TrendingDown, BarChart2, Tag, Fingerprint,
  CalendarDays, Cross, LogOut, ChevronLeft, ChevronDown,
  User, Gift,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useState } from 'react'
import clsx from 'clsx'

type NavItem = {
  to: string
  label: string
  icon: React.ElementType
  end?: boolean
  roles?: string[]
}

type NavGroup = {
  label: string
  items: NavItem[]
  roles?: string[]   // if set, hide group if user has none of these roles
}

const navGroups: NavGroup[] = [
  {
    label: '',
    items: [
      { to: '/dashboard', label: 'Inicio', icon: LayoutDashboard, end: true },
    ],
  },
  {
    // Acceso personal solo para MIEMBRO
    label: 'Mi Espacio',
    roles: ['MIEMBRO'],
    items: [
      { to: '/dashboard/mi-perfil',   label: 'Mi Perfil',    icon: User,        roles: ['MIEMBRO'] },
      { to: '/dashboard/cumpleanios', label: 'Cumpleaños',   icon: Gift,        roles: ['MIEMBRO'] },
      { to: '/dashboard/eventos',     label: 'Eventos',      icon: CalendarDays, roles: ['MIEMBRO'] },
    ],
  },
  {
    label: 'Comunidad',
    roles: ['ENCARGADO','MAESTRO','TESORERO','ADMIN','SUPER_ADMIN'],
    items: [
      { to: '/dashboard/personas',    label: 'Personas',     icon: Users,      roles: ['ENCARGADO','MAESTRO','TESORERO','ADMIN','SUPER_ADMIN'] },
      { to: '/dashboard/miembros',    label: 'Miembros',     icon: UserCheck,  roles: ['ADMIN','SUPER_ADMIN'] },
      { to: '/dashboard/aprobaciones',label: 'Aprobaciones', icon: UserCheck,  roles: ['ADMIN','SUPER_ADMIN'] },
    ],
  },
  {
    label: 'Culto',
    roles: ['ENCARGADO','MAESTRO','TESORERO','ADMIN','SUPER_ADMIN'],
    items: [
      { to: '/dashboard/sesiones',    label: 'Sesiones',     icon: Calendar,     roles: ['ENCARGADO','ADMIN','SUPER_ADMIN'] },
      { to: '/dashboard/asistencias', label: 'Asistencias',  icon: ClipboardList,roles: ['ENCARGADO','ADMIN','SUPER_ADMIN'] },
      { to: '/dashboard/eventos',     label: 'Eventos',      icon: CalendarDays, roles: ['ENCARGADO','ADMIN','SUPER_ADMIN'] },
    ],
  },
  {
    label: 'Formación',
    items: [
      { to: '/dashboard/escuelas',    label: 'Escuelas',     icon: GraduationCap, roles: ['MAESTRO','ADMIN','SUPER_ADMIN'] },
      { to: '/dashboard/cursos',      label: 'Cursos',       icon: BookOpen,      roles: ['MAESTRO','ADMIN','SUPER_ADMIN'] },
    ],
  },
  {
    label: 'Organización',
    items: [
      { to: '/dashboard/ministerios',    label: 'Ministerios',    icon: Church, roles: ['ADMIN','SUPER_ADMIN'] },
      { to: '/dashboard/celulas',        label: 'Células',        icon: Circle, roles: ['ADMIN','SUPER_ADMIN'] },
      { to: '/dashboard/sedes',          label: 'Sedes',          icon: MapPin, roles: ['ADMIN','SUPER_ADMIN'] },
      { to: '/dashboard/otras-iglesias', label: 'Otras Iglesias', icon: Globe,  roles: ['ADMIN','SUPER_ADMIN'] },
    ],
  },
  {
    label: 'Finanzas',
    roles: ['TESORERO','ADMIN','SUPER_ADMIN'],
    items: [
      { to: '/dashboard/ingresos',   label: 'Ingresos',  icon: TrendingUp,  roles: ['TESORERO','ADMIN','SUPER_ADMIN'] },
      { to: '/dashboard/egresos',    label: 'Egresos',   icon: TrendingDown,roles: ['TESORERO','ADMIN','SUPER_ADMIN'] },
      { to: '/dashboard/reportes',   label: 'Reportes',  icon: BarChart2,   roles: ['TESORERO','ADMIN','SUPER_ADMIN'] },
    ],
  },
  {
    label: 'Configuración',
    roles: ['ENCARGADO','ADMIN','SUPER_ADMIN'],
    items: [
      { to: '/dashboard/roles',   label: 'Roles',   icon: Tag,         roles: ['ADMIN','SUPER_ADMIN'] },
      { to: '/dashboard/huellas', label: 'Huellas', icon: Fingerprint, roles: ['ENCARGADO','ADMIN','SUPER_ADMIN'] },
    ],
  },
]

function NavItemLink({ to, label, icon: Icon, end, collapsed }: NavItem & { collapsed: boolean }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        clsx(
          'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
          isActive
            ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/30'
            : 'text-slate-400 hover:text-white hover:bg-white/5'
        )
      }
    >
      <Icon className="w-4 h-4 shrink-0" />
      {!collapsed && <span>{label}</span>}
    </NavLink>
  )
}

export default function Sidebar() {
  const { user, logout } = useAuth()
  const [collapsed, setCollapsed] = useState(false)
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({})

  const userRoles = user?.roles ?? []
  const hasRole = (roles?: string[]) => !roles || roles.some(r => userRoles.includes(r))

  const toggleGroup = (label: string) => {
    setCollapsedGroups(prev => ({ ...prev, [label]: !prev[label] }))
  }

  return (
    <aside
      className={clsx(
        'flex flex-col bg-dark-950 border-r border-white/10 transition-all duration-300 min-h-screen',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gold-500 rounded-lg flex items-center justify-center">
              <Cross className="w-3.5 h-3.5 text-dark-900" />
            </div>
            <span className="text-white font-semibold text-sm font-display">Sanidad Divina</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(v => !v)}
          className="text-slate-400 hover:text-white transition-colors ml-auto"
        >
          <ChevronLeft className={clsx('w-4 h-4 transition-transform', collapsed && 'rotate-180')} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {navGroups.map(group => {
          if (!hasRole(group.roles)) return null
          const visibleItems = group.items.filter(i => hasRole(i.roles))
          if (visibleItems.length === 0) return null

          const isGroupCollapsed = collapsedGroups[group.label] ?? false

          return (
            <div key={group.label || '__home'} className="mb-1">
              {/* Group header */}
              {group.label && !collapsed && (
                <button
                  onClick={() => toggleGroup(group.label)}
                  className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-widest hover:text-slate-400 transition-colors"
                >
                  <span>{group.label}</span>
                  <ChevronDown className={clsx('w-3 h-3 transition-transform', isGroupCollapsed && '-rotate-90')} />
                </button>
              )}
              {group.label && collapsed && (
                <div className="h-px bg-white/10 my-2 mx-2" />
              )}

              {!isGroupCollapsed && (
                <div className="space-y-0.5">
                  {visibleItems.map(item => (
                    <NavItemLink key={item.to} {...item} collapsed={collapsed} />
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* User / Logout */}
      <div className="p-2 border-t border-white/10">
        {!collapsed && user && (
          <div className="px-3 py-2 mb-1">
            <p className="text-white text-xs font-medium truncate">{user.nombres ?? user.email}</p>
            <p className="text-slate-500 text-xs truncate">{user.email}</p>
            {userRoles.length > 0 && (
              <p className="text-gold-500/70 text-xs mt-0.5">{userRoles[0]}</p>
            )}
          </div>
        )}
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Cerrar sesión</span>}
        </button>
      </div>
    </aside>
  )
}
