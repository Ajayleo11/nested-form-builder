import { IconButton, Badge } from './ui'

const SAVE_LABEL = {
  idle:   'Save',
  saving: 'Saving…',
  saved:  'Saved',
  error:  'Failed',
}

const SAVE_VARIANT = {
  idle:   'default',
  saving: 'default',
  saved:  'green',
  error:  'red',
}

export default function SaveBar({ isDirty, saveState, onSave, onReload }) {
  return (
    <div className="flex items-center gap-3 flex-wrap mb-6">
      <div>
        <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">
          Nested Form
        </h1>
        {/* <p className="text-xs text-gray-400 tracking-wide mt-0.5">
          API-driven · recursive · repeatable classes and attributes
        </p> */}
      </div>

      <div className="ml-auto flex items-center gap-2 flex-wrap">
        {isDirty && <Badge color="yellow">unsaved changes</Badge>}

        <IconButton
          variant="ghost"
          onClick={onReload}
          title="Reload schema from API"
        >
           Reload
        </IconButton>

        <IconButton
          variant={SAVE_VARIANT[saveState]}
          onClick={onSave}
          disabled={saveState === 'saving'}
          title="Save schema"
        >
          {SAVE_LABEL[saveState]}
        </IconButton>
      </div>
    </div>
  )
}
