import { hash, compare } from 'bcrypt'
import crypto from 'crypto'

export function generateEmailToken(): string {
  return Math.floor(10000000 + Math.random() * 90000000).toString()
}

export function validateHash(value: string, hash: string): Promise<boolean> {
  return compare(value, hash)
}

export function createHash(value: string): Promise<string> {
  return hash(value, 10)
}

export function createHashOneWay(value: string) {
  const hash = crypto.createHash('sha256')
  hash.update(value)

  return hash.digest('hex')
}
