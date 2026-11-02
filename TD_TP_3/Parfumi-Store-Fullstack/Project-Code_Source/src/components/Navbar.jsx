import { useSelector } from 'react-redux'

function Navbar({ searchTerm, setSearchTerm }) {
  const cartItems = useSelector((state) => state.cart.items)
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  return (
    <header className="navbar">
      <a href="#home" className="logo">PARFUMI</a>

      <div className="search-container">
        <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7" /><path d="m16 16 4 4" />
        </svg>
        <input type="search" aria-label="Search perfumes by name" placeholder="Search perfumes by name..." value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
        {searchTerm && <button type="button" className="clear-search" onClick={() => setSearchTerm('')} aria-label="Clear search">&times;</button>}
      </div>

      <div className="navbar-actions">
        <a href="#cart" className="cart-link">Cart <span className="cart-count">{itemCount}</span></a>
      </div>
    </header>
  )
}

export default Navbar
