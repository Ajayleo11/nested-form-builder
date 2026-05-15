import { useState, useEffect }     from 'react'
import { fetchSchema, saveSchema } from '../api/schemaApi'
import {
  updateNodeInTree,
  removeNodeFromTree,
  insertClassRepeat,
} from '../utils/treeUtils'
import { generateId } from '../utils/idUtils'

export function useSchema() {
  const [schema,    setSchema]    = useState(null)
  const [loading,   setLoading]   = useState(true)
  const [saveState, setSaveState] = useState('idle')  
  const [saveMsg,   setSaveMsg]   = useState('')
  const [isDirty,   setIsDirty]   = useState(false)

  const load = () => {
    setLoading(true)
    setIsDirty(false)
    setSaveState('idle')
    setSaveMsg('')
    fetchSchema().then((data) => {
      setSchema(data)
      setLoading(false)
    })
  }

  useEffect(load, [])

  const dirty = () => setIsDirty(true)


  const updateAttr = (classId, attrId, field, value) => {
    setSchema((s) => ({
      ...s,
      classes: updateNodeInTree(s.classes, classId, (cls) => ({
        ...cls,
        attributes: cls.attributes.map((a) =>
          a.id === attrId ? { ...a, [field]: value } : a
        ),
      })),
    }))
    dirty()
  }

  const repeatClass = (sourceId) => {
    setSchema((s) => ({
      ...s,
      classes: insertClassRepeat(s.classes, sourceId),
    }))
    dirty()
  }

  const removeClass = (classId) => {
    setSchema((s) => ({
      ...s,
      classes: removeNodeFromTree(s.classes, classId),
    }))
    dirty()
  }


  const repeatAttr = (classId, attrId) => {
    setSchema((s) => ({
      ...s,
      classes: updateNodeInTree(s.classes, classId, (cls) => {
        const attrs = [...cls.attributes]

        const original = attrs.find(
          (a) => a.id === attrId || a._sourceId === attrId
        )
        const sourceId = original._sourceId ?? attrId

        const lastIdx = attrs.reduce(
          (m, a, i) =>
            a.id === sourceId || a._sourceId === sourceId ? i : m,
          -1
        )

        const groupCount = attrs.filter(
          (a) => a.id === sourceId || a._sourceId === sourceId
        ).length

        const newAttr = {
          ...original,
          id: generateId('a'),
          _sourceId: sourceId,
          _repeated: true,
          _idx: groupCount,
          value: '',
        }

        attrs.splice(lastIdx + 1, 0, newAttr)
        return { ...cls, attributes: attrs }
      }),
    }))
    dirty()
  }

  const removeAttr = (classId, attrId) => {
    setSchema((s) => ({
      ...s,
      classes: updateNodeInTree(s.classes, classId, (cls) => ({
        ...cls,
        attributes: cls.attributes.filter((a) => a.id !== attrId),
      })),
    }))
    dirty()
  }

  const save = (dataObject) => {
    setSaveState('saving')
    saveSchema(dataObject)
      .then((res) => {
        setSaveState('saved')
        setSaveMsg(`Saved at ${new Date(res.savedAt).toLocaleTimeString()}`)
        setIsDirty(false)
        setTimeout(() => { setSaveState('idle'); setSaveMsg('') }, 3000)
      })
      .catch((err) => {
        setSaveState('error')
        setSaveMsg(err.message)
        setTimeout(() => { setSaveState('idle'); setSaveMsg('') }, 4000)
      })
  }

  return {
    // state
    schema,
    loading,
    isDirty,
    saveState,
    saveMsg,
    // actions
    load,
    updateAttr,
    repeatClass,
    removeClass,
    repeatAttr,
    removeAttr,
    save,
  }
}