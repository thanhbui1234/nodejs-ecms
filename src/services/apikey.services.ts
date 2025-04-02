import apiKeyModels from '@/models/apiKey.models'

const findKeyByID = async (key: any) => {
  const objKey = await apiKeyModels.findOne({ key, status: true }).lean()
  return objKey
}

export default findKeyByID
