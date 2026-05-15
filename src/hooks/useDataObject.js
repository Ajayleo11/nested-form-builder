export function buildDataObject(schema) {
  if (!schema) return {}

  return {
    [schema.module.name]: buildClassesObject(schema.classes),
  }
}


function buildClassesObject(classes) {
  if (!classes?.length) return {}

  const groups = {}   
  const order  = []   

  classes.forEach((cls) => {
    if (!groups[cls.name]) {
      groups[cls.name] = []
      order.push(cls.name)
    }
    groups[cls.name].push(cls)
  })

  const result = {}

  order.forEach((name) => {
    const instances = groups[name]

    result[name] = instances.map((cls) => buildClassInstance(cls))
  })

  return result
}


function buildClassInstance(cls) {
  const obj = {}

  const attrGroups = {}
  const attrOrder  = []

  cls.attributes.forEach((attr) => {
    if (!attrGroups[attr.name]) {
      attrGroups[attr.name] = []
      attrOrder.push(attr.name)
    }
    attrGroups[attr.name].push(attr.value)
  })

  attrOrder.forEach((name) => {
    const values = attrGroups[name]
    obj[name] = values.length === 1 ? values[0] : values
  })

  if (cls.classes?.length) {
    const nestedObj = buildClassesObject(cls.classes)
    Object.assign(obj, nestedObj)
  }

  return obj
}

export function getValueFromPath(dataObj, path) {
  return path.split('/').reduce((acc, key) => {
    if (acc === undefined || acc === null) return undefined
    const index = parseInt(key, 10)
    return isNaN(index) ? acc[key] : acc[index]
  }, dataObj)
}