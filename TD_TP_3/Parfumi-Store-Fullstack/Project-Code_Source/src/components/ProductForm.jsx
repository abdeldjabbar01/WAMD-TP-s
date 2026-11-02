import { useEffect, useState } from 'react'

const emptyProduct = { name: '', description: '', price: '', category: '', imageUrl: '', stock: '0' }

function ProductForm({ product, onSave, onCancel, saving }) {
  const [form, setForm] = useState(emptyProduct)

  useEffect(() => {
    setForm(product ? {
      name: product.name || '', description: product.description || '',
      price: String(product.price ?? ''), category: product.category || '',
      imageUrl: product.imageUrl || product.image || '', stock: String(product.stock ?? 0),
    } : emptyProduct)
  }, [product])

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  const submit = (event) => {
    event.preventDefault()
    onSave({ ...form, price: Number(form.price), stock: Number(form.stock) })
  }

  return (
    <form className="product-manager-form" onSubmit={submit}>
      <div className="product-manager-form-heading">
        <div><span className="auth-eyebrow">PRODUCT MANAGEMENT</span><h3>{product ? 'Edit product' : 'Add a product'}</h3></div>
        <button className="manager-cancel" type="button" onClick={onCancel}>Cancel</button>
      </div>
      <div className="manager-fields">
        <label>Product name<input name="name" value={form.name} onChange={update} required /></label>
        <label>Category<input name="category" value={form.category} onChange={update} required /></label>
        <label>Price (DA)<input name="price" type="number" min="0" step="0.01" value={form.price} onChange={update} required /></label>
        <label>Stock<input name="stock" type="number" min="0" step="1" value={form.stock} onChange={update} required /></label>
        <label className="manager-wide">Image URL<input name="imageUrl" type="text" value={form.imageUrl} onChange={update} placeholder="https://…" required /></label>
        <label className="manager-wide">Description<textarea name="description" rows="3" value={form.description} onChange={update} required /></label>
      </div>
      <button className="manager-save" type="submit" disabled={saving}>{saving ? 'Saving…' : product ? 'Save changes' : 'Create product'}</button>
    </form>
  )
}

export default ProductForm
