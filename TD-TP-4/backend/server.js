require('dotenv').config()

const express = require('express')
const connectDB = require('./config/db')
const Product = require('./models/Product')
const User = require('./models/User')
const Order = require('./models/Order')
const authRoutes = require('./routes/authRoutes')
const protect = require('./middleware/authMiddleware')
const requireAdmin = require('./middleware/adminMiddleware')
const { rateLimit } = require('express-rate-limit')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 5000
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',').map((origin) => origin.trim()).filter(Boolean)

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true)
    return callback(new Error('Origin is not allowed by CORS'))
  },
}))
app.use(express.json({ limit: '1mb' }))

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { message: 'Too many requests. Please try again later.' },
})
app.use('/api', apiLimiter)
app.use('/api/auth', authRoutes)

app.get('/', (req, res) => res.send('Welcome to Parfumi Store API!'))
app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'Parfumi Store API' }))

app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 })
    return res.json(products)
  } catch {
    return res.status(500).json({ message: 'Unable to retrieve products' })
  }
})

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ message: 'Product not found' })
    return res.json(product)
  } catch {
    return res.status(400).json({ message: 'Invalid product ID' })
  }
})

const productFields = ['name', 'description', 'price', 'category', 'imageUrl', 'stock']
function pickProductFields(body) {
  const result = {}
  for (const field of productFields) {
    if (Object.prototype.hasOwnProperty.call(body, field)) result[field] = body[field]
  }
  return result
}

app.post('/api/products', protect, requireAdmin, async (req, res) => {
  try {
    const product = await Product.create(pickProductFields(req.body))
    return res.status(201).json(product)
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
})

app.put('/api/products/:id', protect, requireAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id, pickProductFields(req.body), { new: true, runValidators: true }
    )
    if (!product) return res.status(404).json({ message: 'Product not found' })
    return res.json(product)
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Unable to update product' })
  }
})

app.delete('/api/products/:id', protect, requireAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)
    if (!product) return res.status(404).json({ message: 'Product not found' })
    return res.json({ message: 'Product deleted successfully' })
  } catch {
    return res.status(400).json({ message: 'Invalid product ID' })
  }
})


app.post('/api/orders', protect, async (req, res) => {
  try {
    const items = Array.isArray(req.body.items) ? req.body.items : []
    if (!items.length) return res.status(400).json({ message: 'Your cart is empty' })
    const normalized = []
    for (const item of items) {
      const productId = String(item.id || item.productId || '')
      const quantity = Math.max(1, Number(item.quantity) || 1)
      if (!productId || !Number.isInteger(quantity)) return res.status(400).json({ message: 'Invalid order items' })
      const product = await Product.findById(productId)
      if (!product) return res.status(400).json({ message: 'A product in your cart is no longer available' })
      if (product.stock < quantity) return res.status(409).json({ message: `${product.name} does not have enough stock` })
      normalized.push({ productId, name: product.name, imageUrl: product.imageUrl, price: product.price, quantity })
    }
    const total = normalized.reduce((sum, i) => sum + i.price * i.quantity, 0)
    const order = await Order.create({ customer: req.user.id, items: normalized, total })
    for (const item of normalized) await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } })
    return res.status(201).json(order)
  } catch { return res.status(500).json({ message: 'Unable to place order' }) }
})
app.get('/api/orders/mine', protect, async (req, res) => {
  try { const orders = await Order.find({ customer: req.user.id }).sort({ createdAt: -1 }); return res.json(orders) }
  catch { return res.status(500).json({ message: 'Unable to retrieve orders' }) }
})
app.get('/api/orders', protect, requireAdmin, async (req, res) => {
  try { const orders = await Order.find().populate('customer', 'name email').sort({ createdAt: -1 }); return res.json(orders) }
  catch { return res.status(500).json({ message: 'Unable to retrieve orders' }) }
})
app.patch('/api/orders/:id/ship', protect, requireAdmin, async (req, res) => {
  try { const order = await Order.findByIdAndUpdate(req.params.id, { status: 'shipped' }, { new: true }).populate('customer', 'name email'); if (!order) return res.status(404).json({ message: 'Order not found' }); return res.json(order) }
  catch { return res.status(400).json({ message: 'Unable to update order' }) }
})
app.get('/api/customers', protect, requireAdmin, async (req, res) => {
  try { const users = await User.find({ role: 'customer' }).select('_id name email createdAt').sort({ createdAt: -1 }); return res.json(users) }
  catch { return res.status(500).json({ message: 'Unable to retrieve customers' }) }
})

async function startServer() {
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI is missing from backend/.env')
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is missing from backend/.env')
  await connectDB()
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
}

if (require.main === module) {
  startServer().catch((error) => {
    console.error('Server startup failed:', error.message)
    process.exit(1)
  })
}

module.exports = app
