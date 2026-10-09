'use client'

import { useMemo, useState, useTransition } from 'react'
import { Minus, Plus } from 'lucide-react'
import AppHeader from '@/components/AppHeader'
import { positionEntfernen, positionHinzufuegen, tischAbrechnen } from '@/app/actions'
import type { PosItem } from '@/lib/menu-data'
import type { Rolle } from '@/lib/auth'
import { cn, formatPreis } from '@/lib/utils'

type Position = { id: string; name: string; preis: number }

export default function Kasse({
  tischName,
  sessionId,
  rolle,
  anfangsPositionen,
  items,
}: {
  tischName: string
  sessionId: string
  rolle: Rolle
  anfangsPositionen: Position[]
  items: PosItem[]
}) {
  const [gruppe, setGruppe] = useState<'essen' | 'trinken'>('essen')
  const [positionen, setPositionen] = useState<Position[]>(anfangsPositionen)
  const [pending, startTransition] = useTransition()
  const [abrechnenPending, startAbrechnen] = useTransition()

  const nachKategorie = useMemo(() => {
    const gefiltert = items.filter((i) => i.gruppe === gruppe)
    const gruppen = new Map<string, PosItem[]>()
    for (const item of gefiltert) {
      const liste = gruppen.get(item.kategorie) ?? []
      liste.push(item)
      gruppen.set(item.kategorie, liste)
    }
    return Array.from(gruppen.entries())
  }, [gruppe, items])

  const summe = positionen.reduce((acc, p) => acc + p.preis, 0)

  function hinzufuegen(item: PosItem) {
    startTransition(async () => {
      const row = await positionHinzufuegen(sessionId, item.name, item.preis)
      setPositionen((prev) => [...prev, row])
    })
  }

  function entfernen(positionId: string) {
    setPositionen((prev) => prev.filter((p) => p.id !== positionId))
    startTransition(async () => {
      await positionEntfernen(positionId, sessionId)
    })
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <AppHeader titel={tischName} rolle={rolle} zurueck="/tische" />

      <div className="flex gap-2 border-b border-border px-4 py-2">
        {(['essen', 'trinken'] as const).map((g) => (
          <button
            key={g}
            onClick={() => setGruppe(g)}
            className={cn(
              'rounded-full px-4 py-1.5 text-sm font-medium',
              gruppe === g ? 'bg-accent text-accent-foreground' : 'bg-card text-muted'
            )}
          >
            {g === 'essen' ? 'Essen' : 'Getränke'}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3">
        {nachKategorie.map(([kategorie, liste]) => (
          <div key={kategorie} className="mb-4">
            <h2 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
              {kategorie}
            </h2>
            <div className="space-y-1">
              {liste.map((item) => (
                <button
                  key={item.id}
                  disabled={pending}
                  onClick={() => hinzufuegen(item)}
                  className="flex w-full items-center justify-between rounded-xl bg-card px-3 py-2.5 text-left active:bg-border disabled:opacity-60"
                >
                  <span className="text-sm">{item.name}</span>
                  <span className="flex items-center gap-2 text-sm font-medium">
                    {formatPreis(item.preis)}
                    <Plus className="h-4 w-4 text-accent" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="max-h-[32dvh] overflow-y-auto border-t border-border bg-card px-4 py-2">
        {positionen.length === 0 ? (
          <p className="py-2 text-center text-sm text-muted">Noch nichts gebucht</p>
        ) : (
          <ul className="space-y-1">
            {positionen.map((p) => (
              <li key={p.id} className="flex items-center justify-between py-1">
                <span className="text-sm">{p.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">{formatPreis(p.preis)}</span>
                  <button onClick={() => entfernen(p.id)} aria-label="Entfernen" className="text-muted">
                    <Minus className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="border-t border-border bg-background p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-medium text-muted">Summe</span>
          <span className="text-xl font-semibold">{formatPreis(summe)}</span>
        </div>
        <button
          disabled={positionen.length === 0 || abrechnenPending}
          onClick={() => startAbrechnen(() => tischAbrechnen(sessionId))}
          className="w-full rounded-2xl bg-accent py-4 text-base font-semibold text-accent-foreground disabled:opacity-40"
        >
          {abrechnenPending ? 'Schließe…' : 'Tisch abrechnen'}
        </button>
      </div>
    </div>
  )
}
