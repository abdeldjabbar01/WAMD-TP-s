const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { rateLimit } = require('express-rate-limit')

const router = express.Router()

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { message: 'Too many login attempts. Please try again later.' },
})

function createToken(user) {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not configured')
  return jwt.sign(
    { id: user._id.toString(), email: user.email, role: user.role || 'customer' },
    process.env.JWT_SECRET,
    { expiresIn: '1d', algorithm: 'HS256' }
  )
}

function publicUser(user) {
  return { id: user._id, name: user.name, email: user.email, role: user.role || 'customer', picture: '' }
}

router.post('/register', async (req, res) => {
  try {
    const name = typeof req.body.name === 'string' ? req.body.name.trim() : ''
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : ''
    const password = typeof req.body.password === 'string' ? req.body.password : ''

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email and password' })
    }
    if (name.length < 2 || name.length > 80) {
      return res.status(400).json({ message: 'Name must contain between 2 and 80 characters' })
    }
    if (password.length < 6 || password.length > 128) {
      return res.status(400).json({ message: 'Password must contain between 6 and 128 characters' })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address' })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) return res.status(409).json({ message: 'Email already registered' })

    const passwordHash = await bcrypt.hash(password, 12)
    const user = await User.create({ name, email, passwordHash, role: 'customer' })
    return res.status(201).json({
      message: 'User registered successfully',
      token: createToken(user),
      user: publicUser(user),
    })
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: 'Email already registered' })
    return res.status(500).json({ message: 'Unable to register user' })
  }
})

router.post('/login', loginLimiter, async (req, res) => {
  try {
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : ''
    const password = typeof req.body.password === 'string' ? req.body.password : ''
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' })
    }

    const user = await User.findOne({ email })
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    return res.json({ message: 'Login successful', token: createToken(user), user: publicUser(user) })
  } catch (error) {
    return res.status(500).json({ message: 'Unable to log in' })
  }
})

module.exports = router
