
import { generateId } from './idUtils'
 
// updateNodeInTree
// Finds a class anywhere in the tree by id and returns a new tree

export function updateNodeInTree(classes, targetId, updaterFn) {
  return classes.map((cls) => {
    if (cls.id === targetId) return updaterFn(cls)
    return {
      ...cls,
      classes: updateNodeInTree(cls.classes ?? [], targetId, updaterFn),
    }
  })
}
 
// removeNodeFromTree
// Removes a class by id from anywhere in the tree.
// Used to delete repeated class instances.

export function removeNodeFromTree(classes, targetId) {
  return classes
    .filter((cls) => cls.id !== targetId)
    .map((cls) => ({
      ...cls,
      classes: removeNodeFromTree(cls.classes ?? [], targetId),
    }))
}
 

// cloneClassEmpty
// Deep-clones a class node with fresh IDs and blank attribute values.
// Used when inserting a repeat of a class.

export function cloneClassEmpty(cls) {
  return {
    ...cls,
    id: generateId('cls'),
    attributes: cls.attributes.map((a) => ({
      ...a,
      id: generateId('a'),
      value: '',
    })),
    classes: (cls.classes ?? []).map(cloneClassEmpty),
  }
}
 
// insertClassRepeat
// Inserts a blank copy of a class (by sourceId) after the last consecutive
// member of its repeat group in the sibling list. Recurses into all children
// so nested class repeats work too.

export function insertClassRepeat(classes, sourceId) {
  const result = []
 
  for (let i = 0; i < classes.length; i++) {
    const cls = classes[i]
 
    // Recurse into children first so nested repeats also work
    result.push({
      ...cls,
      classes: insertClassRepeat(cls.classes ?? [], sourceId),
    })
 
    const isMember = cls.id === sourceId || cls._sourceId === sourceId
 
    if (isMember) {
      // Only insert AFTER the last consecutive member of this group
      const next = classes[i + 1]
      const nextIsMember =
        next && (next.id === sourceId || next._sourceId === sourceId)
 
      if (!nextIsMember) {
        const groupCount = classes.filter(
          (c) => c.id === sourceId || c._sourceId === sourceId
        ).length
 
        const original = classes.find((c) => c.id === sourceId)
        const copy = cloneClassEmpty(original)
        copy._sourceId = sourceId
        copy._repeated = true
        copy._idx = groupCount 
 
        result.push(copy)
      }
    }
  }
 
  return result
}