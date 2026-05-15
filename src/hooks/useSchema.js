import { useState, useEffect, useMemo } from 'react'
import { fetchSchema, saveSchema }       from '../api/schemaApi'
import {
  updateAttrByPath,
  insertClassRepeat,
  removeNodeByPath,
  insertAttrRepeat,
  removeAttrByPath,
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

  const updateAttr = (classPath, attrName, attrIndex, field, value) => {
    setSchema((s) => ({
      ...s,
      classes: updateAttrByPath(s.classes, classPath, attrName, attrIndex, field, value),
    }))
    dirty()
  }


  const repeatClass = (parentPath, sourceName) => {
    setSchema((s) => ({
      ...s,
      classes: insertClassRepeat(s.classes, parentPath, sourceName),
    }))
    dirty()
  }


  const removeClass = (classPath) => {
    setSchema((s) => ({
      ...s,
      classes: removeNodeByPath(s.classes, classPath),
    }))
    dirty()
  }


  const repeatAttr = (classPath, attrName) => {
    setSchema((s) => ({
      ...s,
      classes: insertAttrRepeat(s.classes, classPath, attrName),
    }))
    dirty()
  }


  const removeAttr = (classPath, attrName, attrIndex) => {
    setSchema((s) => ({
      ...s,
      classes: removeAttrByPath(s.classes, classPath, attrName, attrIndex),
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