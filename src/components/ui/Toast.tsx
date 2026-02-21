import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'
import type { Toast, ToastType } from '../../hooks/useToast'

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
  error:   <XCircle className="w-5 h-5 text-red-500" />,
  warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
  info:    <Info className="w-5 h-5 text-blue-500" />,
}

const bgClasses: Record<ToastType, string> = {
  success: 'border-l-4 border-emerald-500',
  error:   'border-l-4 border-red-500',
  warning: 'border-l-4 border-yellow-500',
  info:    'border-l-4 border-blue-500',
}

interface ToastItemProps {
  toast: Toast
  onRemove: (id: string) => void
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  return (
    <div
      className={`flex items-start gap-3 bg-white shadow-lg rounded-xl p-4 pr-3 min-w-72 max-w-sm ${bgClasses[toast.type]} animate-in slide-in-from-right`}
    >
      {icons[toast.type]}
      <p className="flex-1 text-sm text-slate-700 leading-snug">{toast.message}</p>
      <button
        onClick={() => onRemove(toast.id)}
        className="text-slate-400 hover:text-slate-600 transition-colors mt-0.5"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

interface ToastContainerProps {
  toasts: Toast[]
  onRemove: (id: string) => void
}

export default function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  if (toasts.length === 0) return null
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  )
}
