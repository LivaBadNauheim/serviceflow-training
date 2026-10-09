import Link from 'next/link'
import { LogOut } from 'lucide-react'
import { logout } from '@/app/actions'
import type { Rolle } from '@/lib/auth'

export default function AppHeader({
  titel,
  rolle,
  zurueck,
}: {
  titel: string
  rolle: Rolle
  zurueck?: string
}) {
  return (
    <header className="flex items-center justify-between border-b border-border px-4 py-3">
      <div className="flex items-center gap-2">
        {zurueck && (
          <Link href={zurueck} className="text-sm text-muted">
            ←
          </Link>
        )}
        <h1 className="text-lg font-semibold">{titel}</h1>
      </div>
      <div className="flex items-center gap-3">
        {rolle === 'admin' && (
          <Link href="/admin" className="text-sm font-medium text-accent">
            Finanzen
          </Link>
        )}
        <form action={logout}>
          <button type="submit" aria-label="Abmelden" className="text-muted">
            <LogOut className="h-5 w-5" />
          </button>
        </form>
      </div>
    </header>
  )
}
