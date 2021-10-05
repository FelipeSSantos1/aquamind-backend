import { hash, compare } from 'bcrypt'

export function generateEmailToken(): string {
  return Math.floor(10000000 + Math.random() * 90000000).toString()
}

export function validateHash(value: string, hash: string): Promise<boolean> {
  return compare(value, hash)
}

export function createHash(value: string): Promise<string> {
  return hash(value, 10)
}
