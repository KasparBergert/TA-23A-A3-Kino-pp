import fs from 'fs'
import path from 'path'
import jwt from 'jsonwebtoken'
import type TokenEnvVars from '../types/TokenEnvVars'
import type TokenTimeType from '../types/TokenTime'
import TokenPair from '../../database/types/TokenPair'

class TokenService {
  readonly PublicKey: jwt.PublicKey
  readonly PrivateKey: jwt.PrivateKey
  readonly TokenTimeShort: TokenTimeType
  readonly TokenTimeLong: TokenTimeType

  constructor() {
    const { PublicKey, PrivateKey, TokenTimeShort, TokenTimeLong } = this.checkTokenEnvVariables()
    this.PublicKey = PublicKey
    this.PrivateKey = PrivateKey
    this.TokenTimeShort = TokenTimeShort
    this.TokenTimeLong = TokenTimeLong
  }

  /**
   * @returns list of enviorment variables, otherwise a crashing error message.
   */
  private checkTokenEnvVariables(): TokenEnvVars {
    //get enviorment variables
    const PrivateKey = fs.readFileSync(path.resolve('secrets/private.pem'), 'utf-8')
    const PublicKey = fs.readFileSync(path.resolve('secrets/public.pem'), 'utf-8')
    const { TokenTimeShort, TokenTimeLong } = process.env

    //test if they exist
    const variables = { PublicKey, PrivateKey, TokenTimeShort, TokenTimeLong }
    Object.entries(variables).map((name, value) => {
      switch (typeof value) {
        case 'undefined':
          throw Error(`JsonWebTokenError: Enviorment variable/s are undefined ${name}`)
      }
    })

    return variables as {
      PublicKey: jwt.PublicKey
      PrivateKey: jwt.PrivateKey
      TokenTimeShort: TokenTimeType
      TokenTimeLong: TokenTimeType
    }
  }

  private createJWT(data: Object, time: TokenTimeType): string {
    return jwt.sign(data, this.PrivateKey, { algorithm: 'RS256', expiresIn: time })
  }

  validateToken(token: string, key: jwt.PublicKey): jwt.JwtPayload {
    const decoded = jwt.verify(token, key, { algorithms: ['RS256'] })
    if(typeof decoded === 'string' || !decoded){throw new Error("INVALID_TOKEN")}
    return decoded;
  }

  createRefreshToken(data: Object): string {
    return this.createJWT(data, this.TokenTimeLong)
  }

  createAccessToken(data: Object): string {
    return this.createJWT(data, this.TokenTimeShort)
  }

  createTokens(data: Object): TokenPair {
    const accessToken = this.createAccessToken(data)
    const refreshToken = this.createRefreshToken(data)
    return { accessToken, refreshToken }
  }

  verifyToken(token: string): jwt.JwtPayload {
    return this.validateToken(token, this.PublicKey)
  }
}

const tokenService = new TokenService()
export default tokenService
