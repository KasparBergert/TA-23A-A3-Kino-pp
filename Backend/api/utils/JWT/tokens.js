import jwt from 'jsonwebtoken'

//haven't tested if it works
const accessKey = process.env.accessToken
const refreshKey = process.env.refreshToken
const expiresInAccess = process.env.expiresInAccess
const expiresInRefresh = process.env.expiresInRefresh

function createJWT(data, key, time) {
  return jwt.sign(data, key, { algorithm: 'HS512', expiresIn: time })
}

function verifyToken(token, key) {
  try {
    return jwt.verify(token, key)
  } catch (error) {
    console.log(error)
    return false // failed to decode token.
  }
}

/**
 * @param {Object} data - data to be made a JWT
 * @returns {string}
 */
export function createAccessToken(data) {
  return createJWT(data, accessKey, expiresInAccess)
}

/**
 * @param {Object} data - data to be made a JWT
 * @returns {string}
 */
export function createRefreshToken(data) {
  return createJWT(data, refreshKey, expiresInRefresh)
}

export function verifyAccess(token) {
  return verifyToken(token, accessKey)
}

export function verifyRefresh(token) {
  return verifyToken(token, refreshKey)
}
