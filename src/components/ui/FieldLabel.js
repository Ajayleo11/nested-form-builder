// src/components/ui/FieldLabel.jsx
// Uppercase label rendered above every form field.
//
// Props:
//   children   ReactNode   label text
//   required   bool        shows red * when true
//   hint       string      small grey note e.g. "(ISO 8601)"

export default function FieldLabel({ children, required = false, hint }) {
  return (
    <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-gray-500 mb-1 select-none">
      {children}
      {required && (
        <span className="text-red-400 font-bold" aria-label="required">
          *
        </span>
      )}
      {hint && (
        <span className="text-[10px] normal-case tracking-normal text-gray-400 font-normal">
          ({hint})
        </span>
      )}
    </label>
  )
}
