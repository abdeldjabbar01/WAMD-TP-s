// One command to run everything:  npm start   (or: node start.js)
// 1) installs dependencies if missing  2) starts the backend  3) starts the Expo app
const { spawn, spawnSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const root = __dirname
const backendDir = path.join(root, 'backend')
const mobileDir = path.join(root, 'mobile')
const PORT = process.env.PORT || '5000'

const log = (msg) => console.log(`\n\x1b[36m[parfumi]\x1b[0m ${msg}`)

function ensureInstalled(dir, name) {
  if (fs.existsSync(path.join(dir, 'node_modules'))) return
  log(`Installing ${name} dependencies (first run only)...`)
  const r = spawnSync('npm', ['install', '--no-audit', '--no-fund'], { cwd: dir, stdio: 'inherit', shell: true })
  if (r.status !== 0) { console.error(`npm install failed in ${name}`); process.exit(1) }
}

function ensureEnv() {
  const envPath = path.join(backendDir, '.env')
  if (fs.existsSync(envPath)) return
  log('backend/.env not found - creating one from .env.example')
  const example = fs.readFileSync(path.join(backendDir, '.env.example'), 'utf8')
  const secret = require('crypto').randomBytes(32).toString('hex')
  fs.writeFileSync(envPath, example.replace(/JWT_SECRET=.*/, `JWT_SECRET=${secret}`))
  console.log('  -> Open backend/.env and set MONGO_URI to your MongoDB connection string, then run again.')
  process.exit(1)
}

ensureEnv()
ensureInstalled(backendDir, 'backend')
ensureInstalled(mobileDir, 'mobile app')

// The app finds the backend automatically from the Expo host IP (see mobile/src/config.js).
// To force a custom address: set EXPO_PUBLIC_API_URL before running npm start.
if (process.env.EXPO_PUBLIC_API_URL) log(`Backend API : ${process.env.EXPO_PUBLIC_API_URL}`)
log('Starting backend and Expo...  (phone and computer must be on the same Wi-Fi)')

const children = []
const run = (cmd, args, cwd, env = {}) => {
  const c = spawn(cmd, args, { cwd, stdio: 'inherit', shell: true, env: { ...process.env, ...env } })
  children.push(c)
  return c
}

if (process.argv.includes('--seed')) {
  log('Seeding sample products...')
  spawnSync('node', ['seed.js'], { cwd: backendDir, stdio: 'inherit', shell: true })
}

run('node', ['server.js'], backendDir)
run('npx', ['expo', 'start'], mobileDir)

const stop = () => { children.forEach((c) => { try { c.kill() } catch {} }); process.exit(0) }
process.on('SIGINT', stop)
process.on('SIGTERM', stop)
