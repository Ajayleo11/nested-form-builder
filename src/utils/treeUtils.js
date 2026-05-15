

import { generateId } from './idUtils'


function reindexSiblings(classes) {
  const nameCounters = {}

  return classes.map((cls) => {
    if (!nameCounters[cls.name]) nameCounters[cls.name] = 0
    const idx = nameCounters[cls.name]++

    return {
      ...cls,
      _idx: idx,
      classes: cls.classes?.length
        ? reindexSiblings(cls.classes)
        : cls.classes,
    }
  })
}


function reindexAttrs(attributes) {
  const nameCounters = {}

  return attributes.map((attr) => {
    if (!nameCounters[attr.name]) nameCounters[attr.name] = 0
    const idx = nameCounters[attr.name]++
    return { ...attr, _idx: idx }
  })
}


export function updateNodeInTree(classes, targetId, updaterFn) {
  return classes.map((cls) => {
    if (cls.id === targetId) return updaterFn(cls)
    return {
      ...cls,
      classes: updateNodeInTree(cls.classes ?? [], targetId, updaterFn),
    }
  })
}


export function removeNodeFromTree(classes, targetId) {
  const filtered = classes
    .filter((cls) => cls.id !== targetId)
    .map((cls) => ({
      ...cls,
      classes: removeNodeFromTree(cls.classes ?? [], targetId),
    }))

  return reindexSiblings(filtered)
}


export function cloneClassEmpty(cls) {
  return {
    ...cls,
    id: generateId('cls'),
    _repeated: true,
    attributes: cls.attributes.map((a) => ({
      ...a,
      id: generateId('a'),
      value: '',
    })),
    classes: (cls.classes ?? []).map(cloneClassEmpty),
  }
}


export function insertClassRepeat(classes, sourceId) {
  const result = []

  for (let i = 0; i < classes.length; i++) {
    const cls = classes[i]

    result.push({
      ...cls,
      classes: insertClassRepeat(cls.classes ?? [], sourceId),
    })

    const isMember = cls.id === sourceId || cls._sourceId === sourceId

    if (isMember) {
      const next = classes[i + 1]
      const nextIsMember =
        next && (next.id === sourceId || next._sourceId === sourceId)

      if (!nextIsMember) {
        const original = classes.find((c) => c.id === sourceId)
        const copy = cloneClassEmpty(original)
        copy._sourceId = sourceId
        copy._repeated = true
        result.push(copy)
      }
    }
  }

  return reindexSiblings(result)
}


export function removeAttrFromClass(classes, classId, attrId) {
  return updateNodeInTree(classes, classId, (cls) => ({
    ...cls,
    attributes: reindexAttrs(
      cls.attributes.filter((a) => a.id !== attrId)
    ),
  }))
}


export function insertAttrRepeat(classes, classId, attrId) {
  return updateNodeInTree(classes, classId, (cls) => {
    const attrs    = [...cls.attributes]
    const original = attrs.find(
      (a) => a.id === attrId || a._sourceId === attrId
    )
    const sourceId = original._sourceId ?? attrId

    const lastIdx = attrs.reduce(
      (m, a, i) =>
        a.id === sourceId || a._sourceId === sourceId ? i : m,
      -1
    )

    const newAttr = {
      ...original,
      id: generateId('a'),
      _sourceId: sourceId,
      _repeated: true,
      value: '',
    }

    attrs.splice(lastIdx + 1, 0, newAttr)

    return { ...cls, attributes: reindexAttrs(attrs) }
  })
}