import { createSlice } from '@reduxjs/toolkit'

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [], hydrated: false },
  reducers: {
    hydrateCart: (state, action) => {
      state.items = action.payload || []
      state.hydrated = true
    },
    addToCart: (state, action) => {
      const { quantity = 1, ...product } = action.payload
      const existing = state.items.find((item) => item.id === product.id)
      const limit = typeof product.stock === 'number' && product.stock > 0 ? product.stock : Infinity
      if (existing) {
        existing.quantity = Math.min(existing.quantity + quantity, limit)
        existing.stock = product.stock
      } else {
        state.items.push({ ...product, quantity: Math.min(quantity, limit) })
      }
    },
    decreaseQuantity: (state, action) => {
      const item = state.items.find((i) => i.id === action.payload)
      if (item && item.quantity > 1) item.quantity -= 1
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((i) => i.id !== action.payload)
    },
    clearCart: (state) => {
      state.items = []
    },
  },
})

export const { hydrateCart, addToCart, decreaseQuantity, removeFromCart, clearCart } = cartSlice.actions
export default cartSlice.reducer
