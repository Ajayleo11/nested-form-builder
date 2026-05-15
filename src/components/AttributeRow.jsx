import { FieldLabel, FieldWrapper, IconButton, Badge } from './ui'

export default function AttributeRow({
  attr,
  classPath,       
  siblingAttrs,
  onAttrChange,
  onAttrRepeat,
  onAttrRemove,
}) {
  const sameNameSiblings = siblingAttrs.filter((a) => a.name === attr.name)
  const instanceIndex    = sameNameSiblings.findIndex((a) => a === attr)
  const groupCount       = sameNameSiblings.length
  const showRemove       = groupCount > 1

  return (
    <div
      className={[
        'flex flex-col gap-1',
        groupCount > 1 && instanceIndex > 0
          ? 'pl-2 border-l-2 border-yellow-300'
          : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="flex items-center gap-1 flex-wrap">
        <FieldLabel>{attr.name}</FieldLabel>

        {attr.required && (
          <span className="text-red-500 text-sm font-bold leading-none">*</span>
        )}

        {groupCount > 1 && (
          <Badge color="yellow">[{instanceIndex}]</Badge>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <input
          type="text"
          value={attr.value}
          placeholder={`Enter ${attr.name}…`}
          onChange={(e) =>
            onAttrChange(classPath, attr.name, instanceIndex, 'value', e.target.value)
          }
          className="flex-1 rounded-md border border-gray-300 bg-white font-mono text-sm px-3 py-1.5 text-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-50 focus:border-blue-400"
        />

        {attr.repeatable && (
          <IconButton
            variant="green"
            size="sm"
            title={`Add a repeat of "${attr.name}"`}
            onClick={() => onAttrRepeat(classPath, attr.name)}
          >
            +
          </IconButton>
        )}

        {showRemove && (
          <IconButton
            variant="red"
            size="sm"
            title="Delete this instance"
            onClick={() => onAttrRemove(classPath, attr.name, instanceIndex)}
          >
            ×
          </IconButton>
        )}
      </div>
    </div>
  )
}
