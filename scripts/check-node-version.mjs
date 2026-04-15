const minimumVersion = [22, 13, 0]

function parseVersion(version) {
  return version.replace(/^v/, '').split('.').map((part) => Number(part || 0))
}

function isBelowMinimum(current, minimum) {
  for (let index = 0; index < minimum.length; index += 1) {
    const currentPart = current[index] || 0
    const minimumPart = minimum[index] || 0

    if (currentPart > minimumPart) return false
    if (currentPart < minimumPart) return true
  }

  return false
}

const currentVersion = parseVersion(process.version)

if (isBelowMinimum(currentVersion, minimumVersion)) {
  const required = minimumVersion.join('.')

  console.error('')
  console.error(`Node ${required}+ is required for this project.`)
  console.error(`Current version: ${process.version}`)
  console.error('')
  console.error('Fix:')
  console.error('  Volta: volta install node@22.21.0 npm@10.9.0')
  console.error('  nvm: nvm install 22.21.0 && nvm use 22.21.0')
  console.error('')

  process.exit(1)
}