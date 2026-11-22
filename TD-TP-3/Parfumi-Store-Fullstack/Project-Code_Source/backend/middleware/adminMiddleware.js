function requireAdmin(req, res, next) {
  const namespace = 'https://parfumi-store/roles'
  const roles = req.user?.[namespace] || req.user?.roles || []
  const isAdmin = req.user?.role === 'admin' || (Array.isArray(roles) && roles.includes('admin'))
  if (!isAdmin) return res.status(403).json({ message: 'Admin access required' })
  return next()
}
module.exports = requireAdmin
