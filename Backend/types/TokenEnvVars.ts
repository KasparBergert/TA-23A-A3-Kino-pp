import type TokenTimeType from "./TokenTime";
import jwt from 'jsonwebtoken'

type TokenEnvVars = {
  PublicKey: jwt.PublicKey
  PrivateKey: jwt.PrivateKey
  TokenTimeShort: TokenTimeType
  TokenTimeLong: TokenTimeType
}
export default TokenEnvVars;
