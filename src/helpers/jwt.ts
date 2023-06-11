import { sign, verify, SignOptions, JwtPayload } from 'jsonwebtoken'
import { PUBLIC_KEY, PRIVATE_KEY } from '../env'

interface VerifyJwtToken {
  valid: boolean
  expired: boolean
  decoded: JwtPayload | string | null
}

export const generateJwtToken = (payload: object, options?: SignOptions | undefined): string => {
  return sign(payload, PRIVATE_KEY, {
    ...(options && options),
    algorithm: 'RS256',
  })
}

export const verifyJwtToken = (token: string): VerifyJwtToken => {
  try {
    const decoded = verify(token, PUBLIC_KEY)

    return {
      valid: true,
      expired: false,
      decoded,
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return {
      valid: false,
      expired: err.message === 'jwt expired',
      decoded: null,
    }
  }
}
