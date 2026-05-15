let _counter = 1000
 
export function generateId(prefix = 'id') {
  return `${prefix}_${++_counter}`
}