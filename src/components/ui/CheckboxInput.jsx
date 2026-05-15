
export default function CheckboxInput({
  checked = false,
  onChange,
  label,
  disabled = false,
}) {
  return (
    <label
      className={[
        'inline-flex items-center gap-2 select-none group',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
      ].join(' ')}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        disabled={disabled}
        className="w-4 h-4 rounded border-gray-300 accent-green-600 cursor-pointer"
      />
      {label && (
        <span className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors">
          {label}
        </span>
      )}
    </label>
  )
}
