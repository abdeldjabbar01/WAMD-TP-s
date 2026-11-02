import { useAuth } from '../context/AuthContext'

function initials(name = '') {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'P'
}

function AccountSidebar({ onLogin, onLogout, onAddProduct }) {
  const { session } = useAuth()
  const user = session?.user
  const isAdmin = session?.role === 'admin' || user?.role === 'admin'

  return (
    <div className="sidebar-content">
      {!session ? (
        <div className="sidebar-guest">
          <button className="sidebar-signin-button" type="button" onClick={onLogin}>
            Sign in <span aria-hidden="true">→</span>
          </button>
        </div>
      ) : (
        <>
          <section className="sidebar-profile" aria-label="Your account">
            <div className="sidebar-profile-row">
              <div className="profile-avatar-wrap">
                {user?.picture
                  ? <img className="profile-avatar" src={user.picture} alt="Profile" referrerPolicy="no-referrer" />
                  : <div className="profile-avatar profile-initials">{initials(user?.name)}</div>}
                <span className="profile-online-dot" />
              </div>
              <div className="profile-details">
                <h2 className="profile-name">{user?.name || 'Welcome back'}</h2>
                {user?.email && <p className="profile-email">{user.email}</p>}
                <span className={`profile-role ${isAdmin ? 'admin' : ''}`}>
                  {isAdmin ? 'Administrator' : 'Parfumi member'}
                </span>
              </div>
            </div>
          </section>

          {isAdmin && (
            <section className="sidebar-management" aria-label="Product management">
              <p className="sidebar-section-label">PRODUCT MANAGEMENT</p>
              <button className="sidebar-tool-button sidebar-add-product" type="button" onClick={onAddProduct}>
                <span aria-hidden="true">＋</span> Add product
              </button>
              <a className="sidebar-tool-link" href="#products">
                <span aria-hidden="true">▦</span> Manage catalog
              </a>
              <p className="sidebar-management-hint">Edit or delete products directly from their product cards.</p>
            </section>
          )}

          <button className="sidebar-signout-button" type="button" onClick={onLogout}>Sign out</button>
        </>
      )}

      <footer className="sidebar-footer">
        <span>PARFUMI</span>
        <p>Thoughtfully chosen fragrances</p>
      </footer>
    </div>
  )
}

export default AccountSidebar
