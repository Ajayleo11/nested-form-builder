import { Badge } from './ui'

export default function ModuleHeader({ module }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
      <div className="flex items-center gap-2 mb-1">
        <Badge color="blue">module</Badge>
        <h2 className="font-extrabold text-base text-gray-900 tracking-tight">
          {module.name}
        </h2>
      </div>
      {module.description && (
        <p className="text-xs text-gray-400 mt-0.5">{module.description}</p>
      )}
    </div>
  )
}
