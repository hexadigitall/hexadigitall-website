// Script to generate admin password hash
// Run with: node generate-admin-hash.js

import crypto from 'crypto'

function generatePasswordHash(password, salt) {
  const hash = crypto.createHash('sha256')
  hash.update(password + salt)
  return hash.digest('hex')
}

// Usage
const password = process.argv[2] || 'change-this-password'
const salt = process.argv[3] || crypto.randomBytes(16).toString('hex')

const hash = generatePasswordHash(password, salt)

console.log('\n=== Admin Credentials ===')
console.log('Add these to your .env.local file:\n')
console.log(`ADMIN_USERNAME=admin`)
console.log(`ADMIN_PASSWORD_HASH=${hash}`)
console.log(`AUTH_SALT=${salt}`)
console.log('\n========================\n')
console.log('To generate with a custom password:')
console.log('node generate-admin-hash.js YOUR_PASSWORD\n')
