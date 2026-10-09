'use client'

import { useState, useTransition } from 'react'
import { Trash2 } from 'lucide-react'
import { belegLoeschen } from '@/app/actions'
import { formatPreis } from '@/lib/utils'

type Beleg = {
  id: string
  tischId: number
  summe: number
  geschlossenAt: Date
}

export default function BelegListe({ belege }: { belege: Beleg[] }) {
  const [geloescht, setGeloescht] = useState<Set<string>>(new Set())
  const [bestaetigenId, setBestaetigenId] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const sichtbar = belege.filter((b) => !geloescht.has(b.id))

  function loeschen(id: string) {
    setGeloescht((prev) => new Set(prev).add(id))
    setBestaetigenId(null)
    startTransition(async () => {
      await belegLoeschen(id)
    })
  }

  if (sichtbar.length === 0) {
    return <p className="text-sm text-muted">Noch keine abgerechneten Tische.</p>
  }

  return (
    <ul className="divide-y divide-border rounded-2xl bg-card px-3">
      {sichtbar.map((b) => (
        <li key={b.id} className="flex items-center justify-between py-2.5 text-sm">
          <div>
            <p className="font-medium">Tisch {b.tischId}</p>
            <p className="text-xs text-muted">
              {b.geschlossenAt.toLocaleString('de-DE', {
                timeZone: 'Europe/Berlin',
                day: '2-digit',
                month: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>

          {bestaetigenId === b.id ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setBestaetigenId(null)}
                className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted"
              >
                Abbrechen
              </button>
              <button
                disabled={pending}
                onClick={() => loeschen(b.id)}
                className="rounded-lg bg-danger px-2.5 py-1.5 text-xs font-medium text-white disabled:opacity-50"
              >
                Löschen
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <span className="font-semibold">{formatPreis(b.summe)}</span>
              <button
                onClick={() => setBestaetigenId(b.id)}
                aria-label="Beleg löschen"
                className="text-muted"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
        </li>
      ))}
    </ul>
  )
}
