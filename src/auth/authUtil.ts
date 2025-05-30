import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || '1223'

export const createTokenPair = async (payload: any) => {
  try {
    const accessToken = jwt.sign(payload, JWT_SECRET, {
      expiresIn: '2 days'
    })

    const refreshToken = jwt.sign(payload, JWT_SECRET, {
      expiresIn: '7 days'
    })

    // Verify token after creation to ensure it's valid
    jwt.verify(accessToken, JWT_SECRET, (err: any, decoded: any) => {
      if (err) {
        console.log(`error in verify accessToken: ${err}`)
      } else {
        console.log(`decoded accessToken: ${decoded}`)
      }
    })

    return { accessToken, refreshToken }
  } catch (error) {
    throw new Error('Failed to create token pair')
  }
}
