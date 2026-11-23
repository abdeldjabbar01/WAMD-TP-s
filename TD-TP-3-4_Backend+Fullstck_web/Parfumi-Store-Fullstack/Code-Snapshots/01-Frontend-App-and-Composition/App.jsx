import { useEffect, useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Cart from './components/Cart'
import Products from './components/Products'
import AuthModal from './components/AuthModal'
import AccountSidebar from './components/AccountSidebar'
import { useAuth } from './context/AuthContext'
import { completeAuth0Login, logoutFromAuth0 } from './services/auth0'

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authMessage, setAuthMessage] = useState('')
  const [addProductRequest, setAddProductRequest] = useState(0)
  const { signIn, signOut, session } = useAuth()

  const handleLogout = () => {
    const usedAuth0 = session?.provider === 'auth0'
    signOut()
    if (usedAuth0) logoutFromAuth0()
  }

  useEffect(() => {
    let active = true
    completeAuth0Login()
      .then((result) => { if (active && result) signIn(result) })
      .catch((error) => { if (active) setAuthMessage(error.message) })
    return () => { active = false }
  }, [signIn])

  return (
    <div className="app">
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {authMessage && <div className="app-notice" role="alert">{authMessage}<button type="button" onClick={() => setAuthMessage('')}>×</button></div>}

      <div className="store-layout">
        <aside className="left-sidebar"><AccountSidebar onLogin={() => setAuthModalOpen(true)} onLogout={handleLogout} onAddProduct={() => setAddProductRequest((current) => current + 1)} /></aside>
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
