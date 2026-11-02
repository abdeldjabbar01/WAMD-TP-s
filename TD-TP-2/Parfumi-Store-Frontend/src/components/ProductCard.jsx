import { useDispatch } from 'react-redux'
import { addToCart } from '../store/cartSlice'

function ProductCard({ product, canManage = false, onEdit, onDelete }) {
  const dispatch = useDispatch()
  const handleAddToCart = () => dispatch(addToCart(product))

  return (
    <article className="product-card">
      <div className="product-image"><img src={product.image} alt={product.name} loading="lazy" /></div>
      <h3>{product.name}</h3>
      <p>{Number(product.price).toLocaleString('en-US')} DA</p>
      <button type="button" onClick={handleAddToCart}>Add to Cart</button>
      {canManage && (
        <div className="product-admin-actions">
          <button type="button" className="product-edit-button" onClick={onEdit}>Edit</button>
          <button type="button" className="product-delete-button" onClick={onDelete}>Delete</button>
        </div>
      )}
    </article>
  )
}

export default ProductCard
