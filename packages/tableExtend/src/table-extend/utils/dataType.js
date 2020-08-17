const types = data => Object.prototype.toString.call(data)

export const isArray = data => {
  return types(data) === '[object Array]'
}

export const isNumber = data => {
  return types(data) === '[object Number]'
}

export const isString = data => {
  return types(data) === '[object String]'
}

export const isObject = data => {
  return types(data) === '[object Object]'
}

export const isNull = data => {
  return types(data) === '[object Null]'
}

export const isUndefined = data => {
  return types(data) === '[object Undefined]'
}

export const isBoolean = data => {
  return types(data) === '[object Boolean]'
}
export const isEmptyObject = data => {
  return types(data) === '[object Object]' && !Object.keys(data).length
}
