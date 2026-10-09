import Link from 'next/link'
import AppHeader from '@/components/AppHeader'
import { getRolle } from '@/lib/session'
import { getServiceClient } from '@/lib/supabase/server'
import { cn, formatPreis } from '@/lib/utils'

export const dynamic = 'force-dynamic'

async function ladeTische() {
  const supabase = getServiceClient()

  const { data: tische } = await supabase.from('tische').select('id, name').order('id')
  const { data: offeneSessions } = await supabase
    .from('tisch_sessions')
    .select('tisch_id, summe')
    .eq('status', 'offen')

  const summenNachTisch = new Map((offeneSessions ?? []).map((s) => [s.tisch_id, Number(s.summe)]))

  return (tische ?? []).map((t) => ({
    id: t.id,
    name: t.name,
    belegt: summenNachTisch.has(t.id),
    summe: summenNachTisch.get(t.id) ?? 0,
  }))
}

export default async function TischuebersichtPage() {
  const rolle = await getRolle()
  const tische = await ladeTische()

  return (
    <div className="flex min-h-dvh flex-col">
      <AppHeader titel="Tische" rolle={rolle!} />

      <main className="grid grid-cols-2 gap-3 p-4">
        {tische.map((tisch) => (
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
    </div>
  )
}
