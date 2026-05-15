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
  classPath,        
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

  const sameNameSiblings = siblingClasses.filter((c) => c.name === cls.name)
  const instanceIndex    = sameNameSiblings.findIndex((c) => c.name === cls.name && siblingClasses.indexOf(c) === siblingClasses.indexOf(cls))
  const groupCount       = sameNameSiblings.length
  const showRemove       = cls.repeatable && groupCount > 1

  const pathParts  = classPath.split('/')
  const parentPath = pathParts.length > 2 ? pathParts.slice(0, -2).join('/') : ''

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
        <span className="text-gray-400 text-xs flex-shrink-0">
          {collapsed ? '▶' : '▼'}
        </span>

        <span className="font-bold text-sm text-gray-800 flex-shrink-0">
          {cls.name}
        </span>

        {groupCount > 1 && (
          <Badge color="yellow">[{instanceIndex}]</Badge>
        )}

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
              onClick={() => onRepeatClass(parentPath, cls.name)}
            >
              +
            </IconButton>
          )}
          {showRemove && (
            <IconButton
              variant="red"
              title="Delete this instance"
              onClick={() => onRemoveClass(classPath)}
            >
              ×
            </IconButton>
          )}
        </div>
      </div>

      {!collapsed && (
        <div className="p-4">

          {cls.attributes.length > 0 && (
            <div className="mb-4 space-y-3">
              {chunk(cls.attributes, 2).map((pair, pairIdx) => (
                <div key={pairIdx} className="grid grid-cols-2 gap-4">
                  {pair.map((attr) => (
                    <AttributeRow
                      key={`${attr.name}-${attr._repeated ? 'r' : 'o'}-${pairIdx}`}
                      attr={attr}
                      classPath={classPath}
                      siblingAttrs={cls.attributes}
                      onAttrChange={onAttrChange}
                      onAttrRepeat={onAttrRepeat}
                      onAttrRemove={onAttrRemove}
                    />
                  ))}
                </div>
              ))}
            </div>
          )}

          {cls.classes?.length > 0 && (
            <div>
              {cls.classes.map((sub) => {
                const subSameName  = cls.classes.filter((c) => c.name === sub.name)
                const subIndex     = subSameName.findIndex((c) => c === sub)
                const subClassPath = `${classPath}/${sub.name}/${subIndex}`

                return (
                  <ClassBlock
                    key={subClassPath}
                    cls={sub}
                    classPath={subClassPath}
                    depth={depth + 1}
                    siblingClasses={cls.classes}
                    onAttrChange={onAttrChange}
                    onAttrRepeat={onAttrRepeat}
                    onAttrRemove={onAttrRemove}
                    onRepeatClass={onRepeatClass}
                    onRemoveClass={onRemoveClass}
                  />
                )
              })}
            </div>
          )}

        </div>
      )}
    </div>
  )
}

function chunk(arr, n) {
  const result = []
  for (let i = 0; i < arr.length; i += n) result.push(arr.slice(i, i + n))
  return result
}
