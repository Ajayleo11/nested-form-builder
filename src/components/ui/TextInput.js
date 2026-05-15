// src/components/ui/TextInput.jsx
// Standard single-line text input used throughout the schema form.
//
// Props:
//   value        string
//   onChange     (value: string) => void
//   placeholder  string
//   label        string
//   required     bool
//   hint         string
//   error        string | bool   string shows message; true just turns border red
//   size         "sm" | "md"     default "md"
//   disabled     bool

import FieldWrapper from './FieldWrapper'

const SIZE = {
  sm: 'px-2.5 py-1   text-xs',
  md: 'px-3   py-1.5 text-sm',
}

export default function TextInput({
  value = '',
  onChange,
  placeholder,
  label,
  required = false,
  hint,
  error,
  size = 'md',
  disabled = false,
}) {
  const hasError = Boolean(error)

  return (
    <FieldWrapper
      label={label}
      required={required}
      hint={hint}
      error={typeof error === 'string' ? error : undefined}
    >
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={[
          'w-full rounded-md border font-mono transition-colors duration-150',
          'focus:outline-none focus:ring-2 focus:ring-offset-0',
          SIZE[size],
          hasError
            ? 'border-red-300 focus:border-red-400 focus:ring-red-100 text-red-700'
            : 'border-gray-300 focus:border-blue-400 focus:ring-blue-50 text-gray-800',
          disabled ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'bg-white',
        ]
          .filter(Boolean)
          .join(' ')}
      />
    </FieldWrapper>
  )
}
