import apiKeyModels from '@/models/apiKey.models'
import crypto from 'crypto'
const findKeyByID = async (key: any) => {
  // const objectKey = await apiKeyModels.create({
  //   key: crypto.randomBytes(64).toString('hex'),
  //   status: true,
  //   permissions: ['0000']
  // })
  // console.log(objectKey, 'objectKey')

  const objKey = await apiKeyModels.findOne({ key, status: true }).lean()
  return objKey
}

export default findKeyByID

export const createKeyApi = async () => {
  const key = await apiKeyModels.create({
    key: crypto.randomBytes(64).toString('hex'),
    status: true,
    permissions: ['0000']
  })
  return key
}