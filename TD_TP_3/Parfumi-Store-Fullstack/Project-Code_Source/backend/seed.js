
require('dotenv').config()

const mongoose = require('mongoose')
const connectDB = require('./config/db')
const Product = require('./models/Product')

const products = [
  {
    name: 'Dior Sauvage',
    description: 'A fresh and powerful fragrance.',
    price: 25000,
    category: 'Men',
    imageUrl: '/images/perfume-1.jpg',
    stock: 10
  },
  {
    name: 'Chanel No.5',
    description: 'An elegant and timeless fragrance.',
    price: 30000,
    category: 'Women',
    imageUrl: '/images/perfume-2.jpg',
    stock: 5
  },
  {
    name: 'Versace Eros',
    description: 'A fresh and intense fragrance.',
    price: 22000,
    category: 'Men',
    imageUrl: '/images/perfume-3.jpg',
    stock: 8
  },
  {
    name: 'YSL Libre',
    description: 'A bold floral fragrance.',
    price: 28000,
    category: 'Women',
    imageUrl: '/images/perfume-4.jpg',
    stock: 6
  }
]

const importData = async () => {
  try {
    await connectDB()

    await Product.deleteMany()
    await Product.insertMany(products)

    console.log('Products Imported Successfully!')

    await mongoose.disconnect()
    process.exit(0)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

importData()
