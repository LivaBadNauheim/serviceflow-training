import AppHeader from '@/components/AppHeader'
import { getRolle } from '@/lib/session'
import { getServiceClient } from '@/lib/supabase/server'
import { monatsKey, tagesKey, wochenKey } from '@/lib/zeit'
import { formatPreis } from '@/lib/utils'

export const dynamic = 'force-dynamic'

async function ladeAbschluesse() {
  const supabase = getServiceClient()

  const { data } = await supabase
    .from('tisch_sessions')
    .select('id, tisch_id, geschlossen_at, summe')
    .eq('status', 'geschlossen')
    .order('geschlossen_at', { ascending: false })
    .limit(2000)

  const sessions = (data ?? []).map((s) => ({
    ...s,
    summe: Number(s.summe),
    geschlossenAt: new Date(s.geschlossen_at as string),
  }))

  const heute = tagesKey(new Date())
  const dieseWoche = wochenKey(new Date())
  const dieserMonat = monatsKey(new Date())

  const tagesSessions = sessions.filter((s) => tagesKey(s.geschlossenAt) === heute)
  const wochenSessions = sessions.filter((s) => wochenKey(s.geschlossenAt) === dieseWoche)
  const monatsSessions = sessions.filter((s) => monatsKey(s.geschlossenAt) === dieserMonat)

  const summiere = (liste: typeof sessions) => liste.reduce((acc, s) => acc + s.summe, 0)

  return {
    tag: { summe: summiere(tagesSessions), anzahl: tagesSessions.length },
    woche: { summe: summiere(wochenSessions), anzahl: wochenSessions.length },
    monat: { summe: summiere(monatsSessions), anzahl: monatsSessions.length },
    letzte: sessions.slice(0, 15),
  }
}

export default async function AdminPage() {
  const rolle = await getRolle()
  const { tag, woche, monat, letzte } = await ladeAbschluesse()

  return (
    <div className="flex min-h-dvh flex-col">
      <AppHeader titel="Finanzen" rolle={rolle!} zurueck="/tische" />

      <main className="space-y-4 p-4">
        <div className="grid grid-cols-1 gap-3">
          <AbschlussKarte titel="Heute" summe={tag.summe} anzahl={tag.anzahl} />
          <AbschlussKarte titel="Diese Woche" summe={woche.summe} anzahl={woche.anzahl} />
          <AbschlussKarte titel="Dieser Monat" summe={monat.summe} anzahl={monat.anzahl} />
        </div>

        <div>
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
            Letzte Abrechnungen
          </h2>
          {letzte.length === 0 ? (
            <p className="text-sm text-muted">Noch keine abgerechneten Tische.</p>
          ) : (
            <ul className="divide-y divide-border rounded-2xl bg-card px-3">
              {letzte.map((s) => (
                <li key={s.id} className="flex items-center justify-between py-2.5 text-sm">
                  <div>
                    <p className="font-medium">Tisch {s.tisch_id}</p>
                    <p className="text-xs text-muted">
                      {s.geschlossenAt.toLocaleString('de-DE', {
                        timeZone: 'Europe/Berlin',
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <span className="font-semibold">{formatPreis(s.summe)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  )
}

function AbschlussKarte({ titel, summe, anzahl }: { titel: string; summe: number; anzahl: number }) {
  return (
    <div className="rounded-2xl bg-card p-4">
      <p className="text-sm text-muted">{titel}</p>
      <p className="mt-1 text-2xl font-semibold">{formatPreis(summe)}</p>
      <p className="mt-0.5 text-xs text-muted">{anzahl} Tisch{anzahl === 1 ? '' : 'e'} abgerechnet</p>
    </div>
  )
}
