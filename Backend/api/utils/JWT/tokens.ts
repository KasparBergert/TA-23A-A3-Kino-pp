import fs from 'fs'
import path from 'path'
import jwt from 'jsonwebtoken'

// public key and private key are the same. current authentication works like this
// user can receive access token and refresh tokene, but the server keeps both keys.
// this is bad because if the server gets hacked, well, users are all gone.
// this can be prevented by giving a custom key to every client and using the public key to encript data.

// implementing with RSA

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

function createJWT(data: object, time: `${number}${'s' | 'm' | 'h' | 'd'}`): string {
  return jwt.sign(data, PrivateKey, { algorithm: 'RS256', expiresIn: time })
}

/**
 * @param token - JWT
 * @param key - access token key or refresh token key
 * @returns jwt payload or string. boolean will always be false, because it represents a verification fail.
 */
function verifyToken(token: string, key: jwt.PublicKey): jwt.JwtPayload | string | boolean {
  try {
    return jwt.verify(token, key, { algorithms: ['RS256'] })
  } catch (error) {
    console.log(error)
    return false // failed to decode token.
  }
}

/**
 * @param {Object} data - data to be made a JWT
 * @returns {string}
 */
export function createRefreshToken(data: object): string {
  return createJWT(data, TokenTimeLong)
}

export function createAccessToken(data: object): string {
  return createJWT(data, TokenTimeShort)
}

/**
 * @param token - JWT
 * @returns jwt payload or string. boolean will always be false, because it represents a verification fail.
 */
export function verifyAccess(token: string): jwt.JwtPayload | string | boolean {
  return verifyToken(token, PublicKey)
}
