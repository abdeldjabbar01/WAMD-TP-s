const jwt = require('jsonwebtoken')
const jwksClient = require('jwks-rsa')

let auth0Client
function getAuth0Client() {
  if (!process.env.AUTH0_DOMAIN || !process.env.AUTH0_AUDIENCE) {
    throw new Error('Auth0 is not configured on the API')
  }
  if (!auth0Client) {
    const domain = process.env.AUTH0_DOMAIN.replace(/^https?:\/\//, '').replace(/\/$/, '')
    auth0Client = jwksClient({
      jwksUri: `https://${domain}/.well-known/jwks.json`,
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 10,
    })
  }
  return auth0Client
}

const getAuth0Key = (header, callback) => {
  let client
  try { client = getAuth0Client() } catch (error) { return callback(error) }
  client.getSigningKey(header.kid, (error, key) => {
    if (error) return callback(error)
    callback(null, key.getPublicKey())
  })
}

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token provided' })
  }

  const token = authHeader.slice(7).trim()
  const decoded = jwt.decode(token, { complete: true })
  if (!decoded?.header?.alg) return res.status(401).json({ message: 'Invalid token' })

  if (decoded.header.alg === 'RS256') {
    const domain = (process.env.AUTH0_DOMAIN || '').replace(/^https?:\/\//, '').replace(/\/$/, '')
    if (!domain || !process.env.AUTH0_AUDIENCE) {
      return res.status(503).json({ message: 'Auth0 is not configured on the API' })
    }
    return jwt.verify(token, getAuth0Key, {
      audience: process.env.AUTH0_AUDIENCE,
      issuer: `https://${domain}/`,
      algorithms: ['RS256'],
    }, (error, payload) => {
      if (error) return res.status(401).json({ message: 'Invalid or expired Auth0 access token' })
      req.user = payload
      return next()
    })
  }

  if (decoded.header.alg === 'HS256') {
    if (!process.env.JWT_SECRET) return res.status(503).json({ message: 'JWT authentication is not configured' })
    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] })
      return next()
    } catch {
      return res.status(401).json({ message: 'Invalid or expired local token' })
    }
  }

  return res.status(401).json({ message: 'Unsupported token algorithm' })
}

module.exports = protect
