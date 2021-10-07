import crypto from 'crypto'

export function validateHash(value: string, hash: string): boolean {
  const sentHash = createHash(value)
  return sentHash === hash
}

export function createHash(value: string) {
  const hash = crypto.createHash('sha256')
  hash.update(value)

  return hash.digest('hex')
}
