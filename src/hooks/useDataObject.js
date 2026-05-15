
export function buildDataObject(schema) {
  if (!schema) return {}

  const obj = {}
  const moduleName = schema.module.name
  const moduleIndex = 0

  function walkClasses(classes, parentPath) {
    const indexMap = buildIndexMap(classes)

    classes.forEach((cls) => {
      const clsIndex = indexMap[cls.id]
      const clsPath  = `${parentPath}/${cls.name}/${clsIndex}`

      walkAttributes(cls.attributes, clsPath)

      if (cls.classes?.length) {
        walkClasses(cls.classes, clsPath)
      }
    })
  }

  function walkAttributes(attributes, clsPath) {
    const indexMap = buildAttrIndexMap(attributes)

    attributes.forEach((attr) => {
      const attrIndex = indexMap[attr.id]
      const key = `${clsPath}/${attr.name}/${attrIndex}/value`
      obj[key] = attr.value
    })
  }

  walkClasses(schema.classes, `${moduleName}/${moduleIndex}`)

  return obj
}


function buildIndexMap(classes) {
  const nameCounters = {}  // tracks how many of each name seen so far
  const map = {}

  classes.forEach((cls) => {
    const name = cls.name
    if (nameCounters[name] === undefined) nameCounters[name] = 0
    map[cls.id] = nameCounters[name]
    nameCounters[name]++
  })

  return map
}


function buildAttrIndexMap(attributes) {
  const nameCounters = {}
  const map = {}

  attributes.forEach((attr) => {
    const name = attr.name
    if (nameCounters[name] === undefined) nameCounters[name] = 0
    map[attr.id] = nameCounters[name]
    nameCounters[name]++
  })

  return map
}


export function getValueFromPath(dataObj, path) {
  return dataObj[path] ?? ''
}


export function setValueAtPath(dataObj, path, value) {
  return { ...dataObj, [path]: value }
}


export function deletePathsForInstance(dataObj, deletedPrefix) {
  const parts        = deletedPrefix.split('/')
  const deletedIndex = parseInt(parts[parts.length - 1], 10)
  const parentPath   = parts.slice(0, -2).join('/')  
  const instanceName = parts[parts.length - 2]       

  const result = {}

  Object.entries(dataObj).forEach(([key, value]) => {
    if (key.startsWith(deletedPrefix + '/') || key === deletedPrefix) {
      return
    }

    const siblingPrefix = `${parentPath}/${instanceName}/`
    if (key.startsWith(siblingPrefix)) {
      const rest         = key.slice(siblingPrefix.length)      
      const siblingIndex = parseInt(rest.split('/')[0], 10)

      if (siblingIndex > deletedIndex) {
        const newIndex  = siblingIndex - 1
        const afterIndex = rest.slice(rest.indexOf('/'))          
        const newKey    = `${siblingPrefix}${newIndex}${afterIndex}`
        result[newKey]  = value
        return
      }
    }

    result[key] = value
  })

  return result
}