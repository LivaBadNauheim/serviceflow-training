import { cookies } from 'next/headers'
import { SESSION_COOKIE_NAME, verifySessionToken, type Rolle } from '@/lib/auth'

// Nur in Server Components/Actions verwendbar (next/headers) – die
// Middleware liest den Cookie direkt über NextRequest, nicht über diese Datei.
export async function getRolle(): Promise<Rolle | null> {
  const cookieStore = await cookies()
  return verifySessionToken(cookieStore.get(SESSION_COOKIE_NAME)?.value)
}
