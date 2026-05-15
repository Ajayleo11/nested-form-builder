export function getNodeByPath(classes, path) {
  const parts = path.split('/')         
  let current = classes

  for (let i = 0; i < parts.length; i += 2) {
    const name  = parts[i]
    const index = parseInt(parts[i + 1], 10)

    const sameNameNodes = current.filter((c) => c.name === name)
    const node = sameNameNodes[index]

    if (!node) return null
    if (i + 2 >= parts.length) return node  // reached the target

    current = node.classes ?? []
  }

  return null
}


export function updateNodeByPath(classes, path, updaterFn) {
  const parts     = path.split('/')
  const name      = parts[0]
  const index     = parseInt(parts[1], 10)
  const restPath  = parts.slice(2).join('/')

  let nameIndex = -1

  return classes.map((cls) => {
    if (cls.name !== name) return cls

    nameIndex++

    if (nameIndex !== index) return cls

    // reached target depth
    if (!restPath) return updaterFn(cls)

    // recurse deeper
    return {
      ...cls,
      classes: updateNodeByPath(cls.classes ?? [], restPath, updaterFn),
    }
  })
}


export function removeNodeByPath(classes, path) {
  const parts    = path.split('/')
  const name     = parts[0]
  const index    = parseInt(parts[1], 10)
  const restPath = parts.slice(2).join('/')

  let nameIndex = -1

  return classes
    .filter((cls) => {
      if (cls.name !== name) return true      

      nameIndex++

      if (restPath) return true                
      return nameIndex !== index              
    })
    .map((cls) => {
      if (cls.name !== name || !restPath) return cls

      return {
        ...cls,
        classes: removeNodeByPath(cls.classes ?? [], restPath),
      }
    })
}


export function cloneClassEmpty(cls) {
  return {
    ...cls,
    _repeated: true,
    attributes: cls.attributes.map((a) => ({
      ...a,
      value: '',
    })),
    classes: (cls.classes ?? []).map(cloneClassEmpty),
  }
}


export function insertClassRepeat(classes, parentPath, sourceName) {
  if (parentPath) {
    return updateNodeByPath(classes, parentPath, (parent) => ({
      ...parent,
      classes: insertAtLevel(parent.classes ?? [], sourceName),
    }))
  }

  return insertAtLevel(classes, sourceName)
}

function insertAtLevel(classes, sourceName) {
  const original = classes.find((c) => c.name === sourceName)
  if (!original) return classes

  const copy = cloneClassEmpty(original)

  let lastIndex = -1
  classes.forEach((c, i) => { if (c.name === sourceName) lastIndex = i })

  const result = [...classes]
  result.splice(lastIndex + 1, 0, copy)
  return result
}


export function removeAttrByPath(classes, classPath, attrName, attrIndex) {
  return updateNodeByPath(classes, classPath, (cls) => {
    let nameIndex = -1
    return {
      ...cls,
      attributes: cls.attributes.filter((a) => {
        if (a.name !== attrName) return true
        nameIndex++
        return nameIndex !== attrIndex
      }),
    }
  })
}


export function insertAttrRepeat(classes, classPath, attrName) {
  return updateNodeByPath(classes, classPath, (cls) => {
    const original = cls.attributes.find((a) => a.name === attrName)
    if (!original) return cls

    const newAttr = { ...original, value: '', _repeated: true }

    let lastIndex = -1
    cls.attributes.forEach((a, i) => { if (a.name === attrName) lastIndex = i })

    const attrs = [...cls.attributes]
    attrs.splice(lastIndex + 1, 0, newAttr)
    return { ...cls, attributes: attrs }
  })
}


export function updateAttrByPath(classes, classPath, attrName, attrIndex, field, value) {
  return updateNodeByPath(classes, classPath, (cls) => {
    let nameIndex = -1
    return {
      ...cls,
      attributes: cls.attributes.map((a) => {
        if (a.name !== attrName) return a
        nameIndex++
        return nameIndex === attrIndex ? { ...a, [field]: value } : a
      }),
    }
  })
}