import _ from 'lodash'

// provip
export const getInfoData = <T>(params: { fields: Array<keyof T>; object: T }): Partial<T> => {
  const { fields, object } = params
  return _.pick(object, fields)
}
