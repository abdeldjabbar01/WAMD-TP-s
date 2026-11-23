import { useSelector, useDispatch } from 'react-redux'
import {
  addToCart,
  removeFromCart,
  decreaseQuantity,
} from '../store/cartSlice'

function Cart() {
  const cartItems = useSelector((state) => state.cart.items)
  const dispatch = useDispatch()
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  return (
    <section className="cart-section" id="cart">
      <h2>Our Perfumes</h2>
      <p className="products-description">
        Discover fragrances that define you.
      </p>
      <div className="cart-heading">
        <div>
          <span className="eyebrow">YOUR SELECTION</span>
          <h2>Shopping Cart</h2>
        </div>
        <span className="cart-count">{cartItems.reduce((total, item) => total + item.quantity, 0)}</span>
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty.</p>
          <span>Choose a fragrance to get started.</span>
        </div>
      ) : (
        <div className="cart-items">
          {cartItems.map((item) => (
            <article className="cart-item" key={item.id}>
              <div className="cart-item-image">
                <img src={item.image} alt={item.name} />
              </div>

              <div className="cart-item-info">
                <h3>{item.name}</h3>
                <p className="cart-item-price">{item.price.toLocaleString('en-US')} DA</p>

                <div className="cart-item-bottom">
                  <div className="quantity-controls">
                    <button
                      type="button"
                      aria-label={`Decrease ${item.name} quantity`}
                      onClick={() => dispatch(decreaseQuantity(item.id))}
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      type="button"
                      aria-label={`Increase ${item.name} quantity`}
                      onClick={() => dispatch(addToCart(item))}
                    >
                      +
                    </button>
                  </div>

                  <button
                    className="remove-button"
                    type="button"
                    onClick={() => dispatch(removeFromCart(item.id))}
                  >
                    Remove
                  </button>
                </div>

                <p className="cart-subtotal">
                  Subtotal: {(item.price * item.quantity).toLocaleString('en-US')} DA
                </p>
              </div>
            </article>
          ))}
        </div>
      )}

      <div className="cart-total">
        <span>Total</span>
        <strong>{totalPrice.toLocaleString('en-US')} DA</strong>
      </div>
      <button className="checkout-button" type="button" disabled={cartItems.length === 0}>
        Continue to checkout
      </button>
    </section>
  )
}

export default Cart
