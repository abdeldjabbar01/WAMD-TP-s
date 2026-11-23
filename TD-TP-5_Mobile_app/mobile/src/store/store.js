import { configureStore } from '@reduxjs/toolkit'
import AsyncStorage from '@react-native-async-storage/async-storage'
import cartReducer, { hydrateCart } from './cartSlice'

const CART_KEY = 'parfumi_cart'

export const store = configureStore({ reducer: { cart: cartReducer } })

// Restore the cart from the device, then keep it saved on every change.
export async function initCartPersistence() {
  try {
    const raw = await AsyncStorage.getItem(CART_KEY)
    store.dispatch(hydrateCart(raw ? JSON.parse(raw) : []))
  } catch {
    store.dispatch(hydrateCart([]))
  }
  let last = store.getState().cart.items
  store.subscribe(() => {
    const items = store.getState().cart.items
    if (items !== last) {
      last = items
      AsyncStorage.setItem(CART_KEY, JSON.stringify(items)).catch(() => {})
    }
  })
}
