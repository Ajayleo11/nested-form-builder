import { FieldLabel, FieldWrapper, CheckboxInput, IconButton, Badge } from './ui'

export default function AttributeRow({
  attr,
  classId,
  onAttrChange,
  onAttrRepeat,
  onAttrRemove,
}) {
  const isRepeat = Boolean(attr._repeated)

  return (
    <div
      className={[
        'grid items-end gap-2 mb-2',
        'grid-cols-[minmax(0,2fr)_auto_auto_auto]',
        isRepeat ? 'pl-2 border-l-2 border-yellow-300' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <FieldWrapper>
        <div className="flex items-center gap-1.5 mb-1 flex-wrap">
          <FieldLabel required={attr.required}>{attr.name}</FieldLabel>
          <span className="text-[10px] font-mono text-gray-400 bg-gray-100 border border-gray-200 rounded px-1.5 py-0.5">
            {attr.type}
          </span>
          {isRepeat && (
            <Badge color="yellow">[{attr._idx}]</Badge>
          )}
        </div>
        <input
          type="text"
          value={attr.value}
          placeholder={`Enter ${attr.name}…`}
          onChange={(e) => onAttrChange(classId, attr.id, 'value', e.target.value)}
          className="w-full rounded-md border border-gray-300 bg-white font-mono text-sm px-3 py-1.5 text-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-50 focus:border-blue-400"
        />
      </FieldWrapper>

      {/* ── Required checkbox ── */}
      <div className="flex flex-col gap-1 pb-0.5">
        <FieldLabel>Req.</FieldLabel>
        <CheckboxInput
          checked={attr.required}
          onChange={(v) => onAttrChange(classId, attr.id, 'required', v)}
        />
      </div>

      
      <div className="flex items-end gap-1 pb-0.5">
        {attr.repeatable && (
          <IconButton
            variant="green"
            title={`Add a repeat of "${attr.name}"`}
            onClick={() => onAttrRepeat(classId, attr.id)}
          >
            +
          </IconButton>
        )}
        {isRepeat && (
          <IconButton
            variant="red"
            title="Delete this instance"
            onClick={() => onAttrRemove(classId, attr.id)}
          >
            ×
          </IconButton>
        )}
      </div>
    </div>
  )
}
