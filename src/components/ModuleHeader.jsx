import { Badge } from './ui'
import ClassBlock from './ClassBlock'

export default function ModuleHeader({
  module,
  classes,
  onAttrChange,
  onAttrRepeat,
  onAttrRemove,
  onRepeatClass,
  onRemoveClass,
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">

      <div className="flex items-center gap-2 mb-1">
        <Badge color="blue">module</Badge>
        <h2 className="font-extrabold text-base text-gray-900 tracking-tight">
          {module.name}
        </h2>
      </div>

      {module.description && (
        <p className="text-xs text-gray-400 mt-0.5 mb-4">{module.description}</p>
      )}

      <hr className="border-gray-100 mb-4" />

      <div className="flex items-center gap-2 mb-3">
        <Badge color="green">classes</Badge>
        <h3 className="font-extrabold text-sm text-gray-700 uppercase tracking-wide">
          Classes
        </h3>
        <span className="text-xs text-gray-400 ml-auto">
          click any header to collapse / expand
        </span>
      </div>

      {classes.map((cls) => (
        <ClassBlock
          key={cls.id}
          cls={cls}
          depth={0}
          siblingClasses={classes}
          onAttrChange={onAttrChange}
          onAttrRepeat={onAttrRepeat}
          onAttrRemove={onAttrRemove}
          onRepeatClass={onRepeatClass}
          onRemoveClass={onRemoveClass}
        />
      ))}

    </div>
  )
}
