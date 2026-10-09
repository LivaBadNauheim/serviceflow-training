// Einfache PIN-Anmeldung statt vollem Account-System – reicht für ein
// internes Trainings-Tool auf einem einzigen Gerät. Die Rolle steckt in
// einem signierten Cookie (HMAC-SHA256 über Web Crypto, läuft sowohl im
// Node- als auch im Edge-Runtime), damit niemand den Cookie-Wert einfach
// von "user" auf "admin" ändern kann.

export type Rolle = 'user' | 'admin'

const COOKIE_NAME = 'sft_session'
const GUELTIGKEIT_MS = 1000 * 60 * 60 * 14 // 14 Stunden, länger als eine Schicht

function getSecret(): string {
  const secret = process.env.SESSION_SECRET
  if (!secret) {
    throw new Error('SESSION_SECRET ist nicht gesetzt')
  }
  return secret
}

function bufToBase64Url(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf)
  let binary = ''
  for (const b of bytes) binary += String.fromCharCode(b)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

async function sign(payload: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sigBuf = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload))
  return bufToBase64Url(sigBuf)
}

export async function createSessionToken(rolle: Rolle): Promise<string> {
  const payload = `${rolle}.${Date.now() + GUELTIGKEIT_MS}`
  const sig = await sign(payload, getSecret())
  return `${payload}.${sig}`
}

export async function verifySessionToken(token: string | undefined | null): Promise<Rolle | null> {
  if (!token) return null

  const teile = token.split('.')
  if (teile.length !== 3) return null
  const [rolle, ablauf, sig] = teile

  if (rolle !== 'user' && rolle !== 'admin') return null
  if (Date.now() > Number(ablauf)) return null

  const erwarteteSig = await sign(`${rolle}.${ablauf}`, getSecret())
  if (sig !== erwarteteSig) return null

  return rolle
}

export function pruefePin(pin: string): Rolle | null {
  if (pin.length === 0) return null
  if (pin === process.env.POS_ADMIN_PIN) return 'admin'
  if (pin === process.env.POS_USER_PIN) return 'user'
  return null
}

export const SESSION_COOKIE_NAME = COOKIE_NAME
export const SESSION_MAX_AGE_SECONDS = GUELTIGKEIT_MS / 1000
