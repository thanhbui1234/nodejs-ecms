import pick from 'lodash/pick'

// provip
export const getInfoData = <T>(params: { fields: Array<keyof T>; object: T }): Partial<T> => {
  const { fields, object } = params
  return pick(object, fields)
}

export const getSelectData = (select: string[]) => {
  return Object.fromEntries(select.map(el => [el, 1]))
}

export const unGetSelectData = (select: string[]) => {
  return Object.fromEntries(select.map(el => [el, 0]))
}


export const removeUndefinedObject = (obj: any) => {
  Object.keys(obj).forEach(key => {
    if (obj[key] === undefined || obj[key] === null) {
      delete obj[key]
    }
  })
  return obj
}

export const updateNestedObjectParser = (obj: any) => {
  const final: any = {}
  Object.keys(obj).forEach(k => {
    if (typeof obj[k] === 'object' && !Array.isArray(obj[k])) {
      const response = updateNestedObjectParser(obj[k])
      Object.keys(response).forEach(a => {
        final[`${k}.${a}`] = response[a]
      })
    } else {
      final[k] = obj[k]
    }
  })
  return final
}

export const convertToBoolean = (val: any): boolean | undefined => {
  if (val === 'true') return true
  if (val === 'false') return false
  return undefined
}

export const convertToNumber = (val: any): number | undefined => {
  const num = Number(val)
  return isNaN(num) ? undefined : num
}