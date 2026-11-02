import { useEffect, useState } from 'react'
import ProductCard from './ProductCard'
import ProductForm from './ProductForm'
import { useAuth } from '../context/AuthContext'
import starterProducts from '../data/products'

const PRODUCTS_STORAGE_KEY = 'parfumi_products'

function readProducts() {
  try {
    const saved = JSON.parse(localStorage.getItem(PRODUCTS_STORAGE_KEY) || 'null')
    if (Array.isArray(saved)) return saved
  } catch {
    // Fall back to the starter catalogue if local storage is unavailable/corrupt.
  }
  return starterProducts
}

function createProductId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `product-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function Products({ searchTerm, addProductRequest = 0 }) {
  const { session } = useAuth()
  const canManageProducts = session?.role === 'admin'
  const [products, setProducts] = useState(readProducts)
  const [managerError, setManagerError] = useState('')
  const [managerNotice, setManagerNotice] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  useEffect(() => {
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products))
    } catch {
      // The catalogue remains usable in memory for this tab if storage is unavailable.
    }
  }, [products])

  useEffect(() => {
    if (addProductRequest > 0 && canManageProducts) {
      setEditingProduct(null)
      setManagerError('')
      setManagerNotice('')
      setFormOpen(true)
      document.getElementById('products')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [addProductRequest, canManageProducts])

  const openEditForm = (product) => {
    setEditingProduct(product)
    setManagerError('')
    setManagerNotice('')
    setFormOpen(true)
  }

  const handleSave = (productData) => {
    setManagerError('')
    setManagerNotice('')

    if (!productData.name?.trim() || !productData.category?.trim() || !productData.imageUrl?.trim()) {
      setManagerError('Please complete all required product fields.')
      return
    }
    if (!Number.isFinite(productData.price) || productData.price < 0) {
      setManagerError('Enter a valid product price.')
      return
    }

    if (editingProduct) {
      setProducts((current) => current.map((product) => (
        product.id === editingProduct.id
          ? { ...product, ...productData, name: productData.name.trim() }
          : product
      )))
      setManagerNotice('Product updated successfully in this browser.')
    } else {
      setProducts((current) => [
        ...current,
        {
          ...productData,
          id: createProductId(),
          name: productData.name.trim(),
        },
      ])
      setManagerNotice('Product added successfully to this browser catalogue.')
    }

    setFormOpen(false)
    setEditingProduct(null)
  }

  const handleDelete = (product) => {
    if (!window.confirm(`Delete "${product.name}" from this browser catalogue?`)) return
    setProducts((current) => current.filter((item) => item.id !== product.id))
    setManagerError('')
    setManagerNotice('Product deleted from this browser catalogue.')
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
        <ProductForm
          product={editingProduct}
          onSave={handleSave}
          onCancel={() => { setFormOpen(false); setEditingProduct(null) }}
          saving={false}
        />
      )}
      {managerError && <p className="manager-message error" role="alert">{managerError}</p>}
      {managerNotice && <p className="manager-message success" role="status">{managerNotice}</p>}

      <div className="products-grid">
        {sortedProducts.length > 0 ? sortedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={{ ...product, image: product.imageUrl || product.image }}
            canManage={canManageProducts}
            onEdit={() => openEditForm(product)}
            onDelete={() => handleDelete(product)}
          />
        )) : (
          <p className="no-search-results">
            {normalizedSearchTerm ? `No perfumes found for “${searchTerm}”.` : 'No products available.'}
          </p>
        )}
      </div>
    </section>
  )
}

export default Products
