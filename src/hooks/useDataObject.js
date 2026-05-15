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
    const repeatable = instances[0].repeatable 

    if (repeatable) {
      result[name] = instances.map((cls) => buildClassInstance(cls))
    } else {
      result[name] = buildClassInstance(instances[0])
    }
  })

  return result
}


function buildClassInstance(cls) {
  const obj = {}

  const attrGroups = {}  
  const attrOrder  = []

  cls.attributes.forEach((attr) => {
    if (!attrGroups[attr.name]) {
      attrGroups[attr.name] = { values: [], repeatable: attr.repeatable }
      attrOrder.push(attr.name)
    }
    attrGroups[attr.name].values.push(attr.value)
  })

  attrOrder.forEach((name) => {
    const { values, repeatable } = attrGroups[name]

    if (repeatable) {
      obj[name] = values
    } else {
      obj[name] = values[0] ?? ''
    }
  })

  if (cls.classes?.length) {
    const nested = buildClassesObject(cls.classes)
    Object.assign(obj, nested)
  }

  return obj
}