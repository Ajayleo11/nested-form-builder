import { useState }          from 'react'
import AttributeRow          from './AttributeRow'
import { IconButton, Badge } from './ui'

const DEPTH_COLORS = [
  'border-l-emerald-400',
  'border-l-blue-400',
  'border-l-orange-400',
  'border-l-purple-400',
  'border-l-pink-400',
]

export default function ClassBlock({
  cls,
  depth = 0,
  siblingClasses,    
  onAttrChange,
  onAttrRepeat,
  onAttrRemove,
  onRepeatClass,
  onRemoveClass,
}) {
  const [collapsed, setCollapsed] = useState(false)
  const depthColor = DEPTH_COLORS[depth % DEPTH_COLORS.length]

  const sourceId   = cls._sourceId ?? cls.id
  const groupCount = siblingClasses.filter(
    (c) => c.id === sourceId || c._sourceId === sourceId
  ).length

  const showRemove = groupCount > 1

  return (
    <div
      className={`border border-gray-200 border-l-4 ${depthColor} rounded-lg mb-3 bg-white overflow-hidden`}
      style={{ marginLeft: depth * 16 }}
    >
      <div
        className={[
          'flex items-center gap-2 px-4 py-2.5 bg-gray-50 cursor-pointer select-none flex-wrap',
          collapsed ? '' : 'border-b border-gray-200',
        ].join(' ')}
        onClick={() => setCollapsed((v) => !v)}
      >
        {/* <span className="text-gray-400 text-xs flex-shrink-0">
          {collapsed ? '▶' : '▼'}
        </span> */}

        <span className="font-bold text-sm text-gray-800 flex-shrink-0">
          {cls.name}
        </span>

        {cls._repeated && <Badge color="yellow">[{cls._idx}]</Badge>}

        {cls.description && (
          <span className="text-xs text-gray-400 truncate min-w-0">
            — {cls.description}
          </span>
        )}

        <div
          className="ml-auto flex gap-1.5 flex-shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          {cls.repeatable && (
            <IconButton
              variant="green"
              title="Add a repeat of this class"
              onClick={() => onRepeatClass(cls.id)}
            >
              +
            </IconButton>
          )}

          {cls.repeatable && showRemove && (
            <IconButton
              variant="red"
              title="Delete this instance"
              onClick={() => onRemoveClass(cls.id)}
            >
              ×
            </IconButton>
          )}
        </div>
      </div>

      {!collapsed && (
        <div className="p-4">

          {cls.attributes.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge color="orange">attributes</Badge>
                <span className="text-xs text-gray-400">
                  {cls.attributes.length} field{cls.attributes.length !== 1 ? 's' : ''}
                </span>
              </div>

              {cls.attributes.map((attr) => (
                <AttributeRow
                  key={attr.id}
                  attr={attr}
                  classId={cls.id}
                  siblingAttrs={cls.attributes}
                  onAttrChange={onAttrChange}
                  onAttrRepeat={onAttrRepeat}
                  onAttrRemove={onAttrRemove}
                />
              ))}
            </div>
          )}

          {cls.classes?.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge color="green">nested classes</Badge>
                <span className="text-xs text-gray-400">
                  {cls.classes.length} class{cls.classes.length !== 1 ? 'es' : ''}
                </span>
              </div>

              {cls.classes.map((sub) => (
                <ClassBlock
                  key={sub.id}
                  cls={sub}
                  depth={depth + 1}
                  siblingClasses={cls.classes}
                  onAttrChange={onAttrChange}
                  onAttrRepeat={onAttrRepeat}
                  onAttrRemove={onAttrRemove}
                  onRepeatClass={onRepeatClass}
                  onRemoveClass={onRemoveClass}
                />
              ))}
            </div>
          )}

        </div>
      )}
    </div>
  )
}
