import fs from 'fs'
import path from 'path'
import jwt from 'jsonwebtoken'

function checkEnviormentVariables(): {
  PublicKey: jwt.PublicKey
  PrivateKey: jwt.PrivateKey
  TokenTimeShort: `${number}${'s' | 'm' | 'h' | 'd'}`
  TokenTimeLong: `${number}${'s' | 'm' | 'h' | 'd'}`
} {
  const PrivateKey = fs.readFileSync(path.resolve('secrets/private.pem'), 'utf-8')
  const PublicKey = fs.readFileSync(path.resolve('secrets/public.pem'), 'utf-8')

  const { TokenTimeShort, TokenTimeLong } = process.env

  const variables = { PublicKey, PrivateKey, TokenTimeShort, TokenTimeLong }
  for (let [name, value] of Object.entries(variables)) {
    switch (typeof value) {
      case 'undefined':
        throw Error(`JsonWebTokenError: Enviorment variable/s are undefined ${name}`)
    }
  }

  return variables as {
    PublicKey: jwt.PublicKey
    PrivateKey: jwt.PrivateKey
    TokenTimeShort: `${number}${'s' | 'm' | 'h' | 'd'}`
    TokenTimeLong: `${number}${'s' | 'm' | 'h' | 'd'}`
  }
}

const { PublicKey, PrivateKey, TokenTimeShort, TokenTimeLong } = checkEnviormentVariables()

function createJWT(data: Object, time: `${number}${'s' | 'm' | 'h' | 'd'}`): string {
  return jwt.sign(data, PrivateKey, { algorithm: 'RS256', expiresIn: time })
}

/**
 * @param token - JWT
 * @param key - access token key or refresh token key
 * @returns jwt payload or string. boolean will always be false, because it represents a verification fail.
 */
function validateToken(token: string, key: jwt.PublicKey): jwt.JwtPayload | string | null {
  try {
    return jwt.verify(token, key, { algorithms: ['RS256'] })
  } catch (error) {
    console.log(error)
    return null // failed to decode token.
  }
}

/**
 * @param {Object} data - data to be made a JWT
 * @returns {string}
 */
export function createRefreshToken(data: Object): string {
  return createJWT(data, TokenTimeLong)
}

export function createAccessToken(data: Object): string {
  return createJWT(data, TokenTimeShort)
}

export function verifyToken(token: string): jwt.JwtPayload | string | null {
  return validateToken(token, PublicKey)
}
