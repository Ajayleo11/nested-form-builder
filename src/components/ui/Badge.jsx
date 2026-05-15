
const COLORS = {
  blue:   'bg-blue-50   text-blue-800   border-blue-200',
  green:  'bg-green-50  text-green-800  border-green-200',
  orange: 'bg-orange-50 text-orange-800 border-orange-200',
  yellow: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  purple: 'bg-purple-50 text-purple-800 border-purple-200',
  red:    'bg-red-50    text-red-800    border-red-200',
  gray:   'bg-gray-50   text-gray-600   border-gray-200',
}

export default function Badge({ children, color = 'gray' }) {
  return (
    <span
      className={[
        'inline-block text-[10px] font-semibold uppercase tracking-wider',
        'px-2 py-0.5 rounded border',
        COLORS[color] ?? COLORS.gray,
      ].join(' ')}
    >
      {children}
    </span>
  )
}
