import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './cartSlice'

const CART_STORAGE_KEY = 'parfumi_cart'

function readCartItems() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]')
    return Array.isArray(saved) ? saved : []
  } catch {
    return []
  }
}

const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
  preloadedState: {
    cart: { items: readCartItems() },
  },
})

store.subscribe(() => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(store.getState().cart.items))
  } catch {
    // The Redux cart remains usable for this session if storage is unavailable.
  }
})

export default store
