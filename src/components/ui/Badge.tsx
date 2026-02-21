import clsx from 'clsx'

type BadgeVariant = 'green' | 'red' | 'yellow' | 'blue' | 'purple' | 'gray' | 'gold'

interface BadgeProps {
  label: string
  variant?: BadgeVariant
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  green:  'bg-emerald-100 text-emerald-700 border-emerald-200',
  red:    'bg-red-100 text-red-700 border-red-200',
  yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  blue:   'bg-blue-100 text-blue-700 border-blue-200',
  purple: 'bg-purple-100 text-purple-700 border-purple-200',
  gray:   'bg-slate-100 text-slate-600 border-slate-200',
  gold:   'bg-amber-100 text-amber-700 border-amber-200',
}

export default function Badge({ label, variant = 'gray', className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border',
        variantClasses[variant],
        className
      )}
    >
      {label}
    </span>
  )
}
