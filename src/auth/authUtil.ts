import jwt from 'jsonwebtoken'
export const createTokenPair = async (payload: any, publicKey: any, privateKey: any) => {
  try {
    const accessToken = jwt.sign(payload, publicKey, {
      expiresIn: '2 days'
    })

    const refeshToken = jwt.sign(payload, privateKey, {
      expiresIn: '7 days'
    })

    jwt.verify(accessToken, publicKey, (err: any, decoded: any) => {
      if (err) {
        console.log(`error in verify accessToken: ${err}`)
      } else {
        console.log(`decoded accessToken: ${decoded}`)
      }
    })

    return { accessToken, refeshToken }
  } catch (error) {}
}
