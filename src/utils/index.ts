import pick from 'lodash/pick'

// provip
export const getInfoData = <T>(params: { fields: Array<keyof T>; object: T }): Partial<T> => {
  const { fields, object } = params
  return pick(object, fields)
}

const getSelectData = <T>(params: { fields: Array<keyof T>; object: T }): Partial<T> => {
  const { fields, object } = params
  return pick(object, fields)
}