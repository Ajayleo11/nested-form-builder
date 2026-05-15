// src/components/ui/FieldWrapper.jsx
// Wraps label + input + optional error message as one unit.
//
// Props:
//   label      string
//   required   bool
//   hint       string
//   error      string    red message shown below the input
//   children   ReactNode the actual input element

import FieldLabel from './FieldLabel'

export default function FieldWrapper({
  label,
  required = false,
  hint,
  error,
  children,
}) {
  return (
    <div className="flex flex-col gap-0.5 w-full">
      {label && (
        <FieldLabel required={required} hint={hint}>
          {label}
        </FieldLabel>
      )}
      {children}
      {error && (
        <p className="text-[11px] text-red-500 mt-0.5 leading-tight">{error}</p>
      )}
    </div>
  )
}
