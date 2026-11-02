import { useCallback, useEffect, useState } from 'react'
import ProductCard from './ProductCard'
import ProductForm from './ProductForm'
import { apiRequest } from '../services/api'
import { useAuth } from '../context/AuthContext'

function Products({ searchTerm, addProductRequest = 0 }) {
  const { session } = useAuth()
  const canManageProducts = session?.role === 'admin' || session?.user?.role === 'admin'
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [managerError, setManagerError] = useState('')
  const [managerNotice, setManagerNotice] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [saving, setSaving] = useState(false)

  const fetchProducts = useCallback(async () => {
    try {
      const data = await apiRequest('/products')
      setProducts(data)
      setError('')
    } catch (err) {
      setError(err.message || 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  useEffect(() => {
    if (addProductRequest > 0 && canManageProducts) {
      setEditingProduct(null)
      setManagerError('')
      setFormOpen(true)
      document.getElementById('products')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [addProductRequest, canManageProducts])

  const openCreateForm = () => {
    setEditingProduct(null)
    setManagerError('')
    setFormOpen(true)
  }

  const openEditForm = (product) => {
    setEditingProduct(product)
    setManagerError('')
    setFormOpen(true)
  }

  const handleSave = async (productData) => {
    setSaving(true)
    setManagerError('')
    setManagerNotice('')
    try {
      if (editingProduct) {
        await apiRequest(`/products/${editingProduct._id}`, {
          method: 'PUT', token: session.token, body: JSON.stringify(productData),
        })
        setManagerNotice('Product updated successfully.')
      } else {
        await apiRequest('/products', {
          method: 'POST', token: session.token, body: JSON.stringify(productData),
        })
        setManagerNotice('Product created successfully.')
      }
      setFormOpen(false)
      setEditingProduct(null)
      await fetchProducts()
    } catch (err) {
      setManagerError(err.message || 'Could not save the product.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.name}" from the store?`)) return
    setManagerError('')
    setManagerNotice('')
    try {
      await apiRequest(`/products/${product._id}`, { method: 'DELETE', token: session.token })
      setManagerNotice('Product deleted successfully.')
      await fetchProducts()
    } catch (err) {
      setManagerError(err.message || 'Could not delete the product.')
    }
  }

  const normalizedSearchTerm = searchTerm.trim().toLocaleLowerCase()
  const matchingProducts = normalizedSearchTerm
    ? products.filter((product) => String(product.name || '').toLocaleLowerCase().includes(normalizedSearchTerm))
    : products
  const sortedProducts = [...matchingProducts].sort((a, b) => {
    if (!normalizedSearchTerm) return 0
    const nameA = String(a.name || '').toLocaleLowerCase()
    const nameB = String(b.name || '').toLocaleLowerCase()
    const getScore = (name) => {
      if (name === normalizedSearchTerm) return 3
      if (name.startsWith(normalizedSearchTerm)) return 2
      if (name.includes(normalizedSearchTerm)) return 1
      return 0
    }
    return getScore(nameB) - getScore(nameA)
  })

  return (
    <section className="products" id="products">
      {canManageProducts && (
        <div className="product-manager-toolbar">
          <div><span className="auth-eyebrow">STORE MANAGEMENT</span><p>Manage your perfume catalog</p></div>
        </div>
      )}

      {canManageProducts && formOpen && (
        <ProductForm product={editingProduct} onSave={handleSave} onCancel={() => { setFormOpen(false); setEditingProduct(null) }} saving={saving} />
      )}
      {managerError && <p className="manager-message error" role="alert">{managerError}</p>}
      {managerNotice && <p className="manager-message success" role="status">{managerNotice}</p>}
      {loading && <p>Loading perfumes...</p>}
      {error && <p role="alert">{error}</p>}

      {!loading && !error && (
        <div className="products-grid">
          {sortedProducts.length > 0 ? sortedProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={{ ...product, id: product._id, image: product.imageUrl }}
              canManage={canManageProducts}
              onEdit={() => openEditForm(product)}
              onDelete={() => handleDelete(product)}
            />
          )) : <p className="no-search-results">{normalizedSearchTerm ? `No perfumes found for “${searchTerm}”.` : 'No products available.'}</p>}
        </div>
      )}
    </section>
  )
}

export default Products
