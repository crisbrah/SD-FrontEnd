import { useState, useEffect } from 'react'
import { WifiOff, Wifi, X, RefreshCw } from 'lucide-react'

type Status = 'online' | 'offline' | 'hidden'

export default function BackendBanner() {
  const [status, setStatus] = useState<Status>('hidden')

  useEffect(() => {
    let hideTimer: ReturnType<typeof setTimeout>

    const handler = (e: Event) => {
      const online = (e as CustomEvent<{ online: boolean }>).detail.online
      clearTimeout(hideTimer)

      if (online) {
        setStatus(prev => {
          // Solo mostrar "conectado" si antes estaba offline (no al cargar la página)
          if (prev === 'offline') {
            hideTimer = setTimeout(() => setStatus('hidden'), 3000)
            return 'online'
          }
          return prev === 'hidden' ? 'hidden' : 'online'
        })
      } else {
        setStatus('offline')
      }
    }

    window.addEventListener('api:status', handler)
    return () => {
      window.removeEventListener('api:status', handler)
      clearTimeout(hideTimer)
    }
  }, [])

  if (status === 'hidden') return null

  if (status === 'offline') {
    return (
      <div className="fixed top-0 left-0 right-0 z-[200] bg-red-600 text-white text-sm py-2.5 px-4 flex items-center gap-3 shadow-lg">
        <WifiOff className="w-4 h-4 shrink-0" />
        <span className="flex-1">
          <strong>Backend no disponible.</strong> El servidor en <code className="bg-red-700 px-1 rounded text-xs">https://sd-backend-s7yo.onrender.com</code> no responde.
          Inicia el backend con <code className="bg-red-700 px-1 rounded text-xs">mvn spring-boot:run</code> o Docker.
        </span>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-1 bg-red-700 hover:bg-red-800 px-2.5 py-1 rounded-lg text-xs transition-colors"
        >
          <RefreshCw className="w-3 h-3" /> Reintentar
        </button>
        <button onClick={() => setStatus('hidden')} className="text-red-200 hover:text-white transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>
    )
  }

  // status === 'online'
  return (
    <div className="fixed top-0 left-0 right-0 z-[200] bg-emerald-500 text-white text-sm py-2 px-4 flex items-center gap-2 shadow-lg">
      <Wifi className="w-4 h-4 shrink-0" />
      <span>Conexión con el servidor restaurada.</span>
    </div>
  )
}
