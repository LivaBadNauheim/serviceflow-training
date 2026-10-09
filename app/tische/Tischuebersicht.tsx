'use client'

import { useState } from 'react'
import Link from 'next/link'
import { cn, formatPreis } from '@/lib/utils'

type Tisch = {
  id: number
  name: string
  bereich: 'drinnen' | 'terrasse'
  belegt: boolean
  summe: number
}

export default function Tischuebersicht({ tische }: { tische: Tisch[] }) {
  const [bereich, setBereich] = useState<'drinnen' | 'terrasse'>('drinnen')

  const gefiltert = tische.filter((t) => t.bereich === bereich)

  return (
    <>
      <div className="flex gap-2 border-b border-border px-4 py-2">
        {(['drinnen', 'terrasse'] as const).map((b) => (
          <button
            key={b}
            onClick={() => setBereich(b)}
            className={cn(
              'rounded-full px-4 py-1.5 text-sm font-medium',
              bereich === b ? 'bg-accent text-accent-foreground' : 'bg-card text-muted'
            )}
          >
            {b === 'drinnen' ? 'Drinnen' : 'Terrasse'}
          </button>
        ))}
      </div>

      <main className="grid grid-cols-2 gap-3 overflow-y-auto p-4">
        {gefiltert.map((tisch) => (
          <Link
            key={tisch.id}
            href={`/tisch/${tisch.id}`}
            className={cn(
              'flex aspect-square flex-col items-center justify-center rounded-2xl border p-3 text-center active:scale-95',
              tisch.belegt
                ? 'border-belegt bg-belegt-bg text-belegt'
                : 'border-frei bg-frei-bg text-frei'
            )}
          >
            <span className="text-xl font-semibold">{tisch.name}</span>
            <span className="mt-1 text-xs font-medium uppercase tracking-wide">
              {tisch.belegt ? 'Belegt' : 'Frei'}
            </span>
            {tisch.belegt && (
              <span className="mt-2 text-sm font-semibold">{formatPreis(tisch.summe)}</span>
            )}
          </Link>
        ))}
      </main>
    </>
  )
}
