
const VARIANTS = {
  default: 'border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700',
  green:   'border-green-300 text-green-600 hover:bg-green-50 hover:border-green-400',
  red:     'border-red-200   text-red-500   hover:bg-red-50   hover:border-red-300',
  blue:    'border-blue-300  text-blue-600  hover:bg-blue-50  hover:border-blue-400',
  ghost:   'border-transparent text-gray-400 hover:text-gray-700 hover:bg-gray-50 hover:border-gray-200',
}

const SIZES = {
  sm: 'px-1.5 py-0.5 text-xs gap-1   rounded',
  md: 'px-2.5 py-1.5 text-xs gap-1.5 rounded-md',
}

export default function IconButton({
  onClick,
  title,
  variant = 'default',
  size = 'md',
  disabled = false,
  children,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={[
        'inline-flex items-center justify-center border font-medium',
        'transition-all duration-150',
        'focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-blue-200',
        VARIANTS[variant] ?? VARIANTS.default,
        SIZES[size],
        disabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : 'cursor-pointer',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </button>
  )
}
