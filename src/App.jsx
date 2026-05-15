import { useState }          from 'react'
import { useSchema }         from './hooks/useSchema'
import { buildDataObject }   from './hooks/useDataObject'
import SaveBar               from './components/SaveBar'
import ModuleHeader          from './components/ModuleHeader'
import { IconButton }        from './components/ui'

export default function App() {
  const {
    schema,
    loading,
    isDirty,
    saveState,
    saveMsg,
    load,
    updateAttr,
    repeatClass,
    removeClass,
    repeatAttr,
    removeAttr,
    save,
  } = useSchema()

  const [showDataObj, setShowDataObj] = useState(false)
  const [copied,      setCopied]      = useState(false)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-400 text-sm gap-2">
        <span className="animate-spin inline-block text-xl">⟳</span>
        Loading schema from API…
      </div>
    )
  }

  const dataObj = buildDataObject(schema)

  // Log live data object to console on every render
  console.log('📦 Data Object:', dataObj)

  const handleSave = () => save(dataObj)

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(dataObj, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 font-mono">

      <SaveBar
        isDirty={isDirty}
        saveState={saveState}
        onSave={handleSave}
        onReload={load}
      />

      {saveMsg && saveState !== 'idle' && (
        <div
          className={[
            'text-xs px-3 py-2 rounded-md mb-4 border',
            saveState === 'saved'
              ? 'bg-green-50 text-green-700 border-green-200'
              : 'bg-red-50 text-red-700 border-red-200',
          ].join(' ')}
        >
          {saveMsg}
        </div>
      )}

      <ModuleHeader
        module={schema.module}
        classes={schema.classes}
        onAttrChange={updateAttr}
        onAttrRepeat={repeatAttr}
        onAttrRemove={removeAttr}
        onRepeatClass={repeatClass}
        onRemoveClass={removeClass}
      />

      <hr className="my-6 border-gray-200" />

      <div className="flex items-center gap-3 mb-2">
        <h2 className="font-extrabold text-sm text-gray-700 uppercase tracking-wide">
          Data Object
        </h2>
        <span className="text-xs text-gray-400">
          {Object.keys(dataObj).length} keys
        </span>
        <IconButton
          variant="ghost"
          size="sm"
          onClick={() => setShowDataObj((v) => !v)}
        >
          {showDataObj ? 'hide' : 'show'}
        </IconButton>
        {showDataObj && (
          <IconButton variant="ghost" size="sm" onClick={handleCopy}>
            {copied ? 'copied!' : 'copy'}
          </IconButton>
        )}
      </div>

      {showDataObj && (
        <pre className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-xs leading-relaxed overflow-x-auto max-h-80 overflow-y-auto">
          {Object.entries(dataObj).map(([k, v]) => (
            <div key={k}>
              <span className="text-blue-600">"{k}"</span>
              {': '}
              <span className="text-green-700">
                {typeof v === 'boolean' ? String(v) : `"${String(v)}"`}
              </span>
              {','}
            </div>
          ))}
        </pre>
      )}

    </div>
  )
}
