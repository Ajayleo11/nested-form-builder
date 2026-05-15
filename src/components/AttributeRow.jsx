import { FieldLabel, FieldWrapper, IconButton, Badge } from './ui'

export default function AttributeRow({
  attr,
  classId,
  siblingAttrs,
  onAttrChange,
  onAttrRepeat,
  onAttrRemove,
}) {
  const isRepeat   = Boolean(attr._repeated)
  const sourceId   = attr._sourceId ?? attr.id
  const groupCount = siblingAttrs.filter(
    (a) => a.id === sourceId || a._sourceId === sourceId
  ).length
  const showRemove = groupCount > 1

  return (
    <div
      className={[
        'flex flex-col gap-1',
        isRepeat ? 'pl-2 border-l-2 border-yellow-300' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="flex items-center gap-1.5 flex-wrap">
        <FieldLabel>{attr.name}</FieldLabel>
        <span className="text-red-500 text-sm font-bold w-2 flex-shrink-0">
          {attr.required ? '*' : ' '}
        </span>
        {isRepeat && <Badge color="yellow">[{attr._idx}]</Badge>}
      </div>

      <div className="flex items-center gap-1.5">
        <input
          type="text"
          value={attr.value}
          placeholder={`Enter ${attr.name}…`}
          onChange={(e) => onAttrChange(classId, attr.id, 'value', e.target.value)}
          className="flex-1 rounded-md border border-gray-300 bg-white font-mono text-sm px-3 py-1.5 text-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-50 focus:border-blue-400"
        />

        {attr.repeatable && (
          <IconButton
            variant="green"
            size="sm"
            title={`Add a repeat of "${attr.name}"`}
            onClick={() => onAttrRepeat(classId, attr.id)}
          >
            +
          </IconButton>
        )}

        {showRemove && (
          <IconButton
            variant="red"
            size="sm"
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
