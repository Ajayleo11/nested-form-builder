// src/components/ui/SelectInput.jsx
// Dropdown select. Accepts string[] or { value, label }[] for options.
//
// Props:
//   value      string
//   onChange   (value: string) => void
//   options    string[] | { value: string, label: string }[]
//   label      string
//   required   bool
//   hint       string
//   size       "sm" | "md"
//   disabled   bool

import FieldWrapper from './FieldWrapper'

const SIZE = {
  sm: 'px-2.5 py-1   text-xs',
  md: 'px-3   py-1.5 text-sm',
}

export default function SelectInput({
  value,
  onChange,
  options = [],
  label,
  required = false,
  hint,
  size = 'md',
  disabled = false,
}) {
  const normalised = options.map((o) =>
    typeof o === 'string' ? { value: o, label: o } : o
  )

  return (
    <FieldWrapper label={label} required={required} hint={hint}>
      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        className={[
          'w-full rounded-md border font-mono appearance-none cursor-pointer',
          'transition-colors duration-150',
          'focus:outline-none focus:ring-2 focus:ring-offset-0',
          'focus:border-blue-400 focus:ring-blue-50',
          SIZE[size],
          'border-gray-300 text-gray-800',
          disabled ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'bg-white',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {normalised.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </FieldWrapper>
  )
}
