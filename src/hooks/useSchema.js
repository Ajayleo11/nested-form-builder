import { useState, useEffect, useMemo } from 'react'
import { fetchSchema, saveSchema }       from '../api/schemaApi'
import {
  updateNodeInTree,
  removeNodeFromTree,
  insertClassRepeat,
  insertAttrRepeat,
  removeAttrFromClass,
} from '../utils/treeUtils'
import { buildDataObject } from './useDataObject'

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

  const dataObject = useMemo(() => buildDataObject(schema), [schema])

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
      classes: insertAttrRepeat(s.classes, classId, attrId),
    }))
    dirty()
  }

  const removeAttr = (classId, attrId) => {
    setSchema((s) => ({
      ...s,
      classes: removeAttrFromClass(s.classes, classId, attrId),
    }))
    dirty()
  }

  const save = (payload) => {
    setSaveState('saving')
    saveSchema(payload)
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
    schema,
    loading,
    isDirty,
    saveState,
    saveMsg,
    dataObject,
    load,
    updateAttr,
    repeatClass,
    removeClass,
    repeatAttr,
    removeAttr,
    save,
  }
}