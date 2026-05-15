
import FieldWrapper from './FieldWrapper'

export default function TextareaInput({
  value = '',
  onChange,
  placeholder,
  label,
  required = false,
  hint,
  error,
  rows = 3,
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
      <textarea
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className={[
          'w-full rounded-md border font-mono text-sm px-3 py-2 resize-y',
          'transition-colors duration-150',
          'focus:outline-none focus:ring-2 focus:ring-offset-0',
          hasError
            ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
            : 'border-gray-300 focus:border-blue-400 focus:ring-blue-50',
          disabled
            ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
            : 'bg-white text-gray-800',
        ]
          .filter(Boolean)
          .join(' ')}
      />
    </FieldWrapper>
  )
}
