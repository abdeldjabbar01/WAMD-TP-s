import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Cart from './components/Cart'
import Products from './components/Products'
import AuthModal from './components/AuthModal'
import AccountSidebar from './components/AccountSidebar'
import { useAuth } from './context/AuthContext'

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [addProductRequest, setAddProductRequest] = useState(0)
  const { signOut } = useAuth()

  return (
    <div className="app">
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <div className="store-layout">
        <aside className="left-sidebar">
          <AccountSidebar
            onLogin={() => setAuthModalOpen(true)}
            onLogout={signOut}
            onAddProduct={() => setAddProductRequest((current) => current + 1)}
          />
        </aside>
        <main className="store-main">
          <Products searchTerm={searchTerm} addProductRequest={addProductRequest} />
        </main>
        <aside className="right-sidebar"><Cart /></aside>
      </div>

      {authModalOpen && <AuthModal onClose={() => setAuthModalOpen(false)} />}
    </div>
  )
}

export default App
