import Link from 'next/link'
import { Download } from 'lucide-react'
import AppHeader from '@/components/AppHeader'
import { getRolle } from '@/lib/session'
import { filterZeitraum, ladeGeschlosseneSessions, ZEITRAUM_LABEL, type Zeitraum } from '@/lib/finanzen'
import { formatPreis } from '@/lib/utils'
import BelegListe from './BelegListe'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const rolle = await getRolle()
  const sessions = await ladeGeschlosseneSessions()

  const zeitraeume: Zeitraum[] = ['tag', 'woche', 'monat']
  const abschluesse = zeitraeume.map((z) => {
    const gefiltert = filterZeitraum(sessions, z)
    return {
      zeitraum: z,
      summe: gefiltert.reduce((acc, s) => acc + s.summe, 0),
      anzahl: gefiltert.length,
    }
  })

  const letzte = sessions.slice(0, 15)

  return (
    <div className="flex min-h-dvh flex-col">
      <AppHeader titel="Finanzen" rolle={rolle!} zurueck="/tische" />

      <main className="space-y-4 p-4">
        <div className="grid grid-cols-1 gap-3">
          {abschluesse.map((a) => (
            <AbschlussKarte key={a.zeitraum} zeitraum={a.zeitraum} summe={a.summe} anzahl={a.anzahl} />
          ))}
        </div>

        <div>
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
            Letzte Abrechnungen
          </h2>
          <BelegListe belege={letzte} />
        </div>
      </main>
    </div>
  )
}

function AbschlussKarte({
  zeitraum,
  summe,
  anzahl,
}: {
  zeitraum: Zeitraum
  summe: number
  anzahl: number
}) {
  return (
    <div className="rounded-2xl bg-card p-4">
      <div className="flex items-start justify-between">
        <p className="text-sm text-muted">{ZEITRAUM_LABEL[zeitraum]}</p>
        <Link
          href={`/admin/export?zeitraum=${zeitraum}`}
          aria-label={`${ZEITRAUM_LABEL[zeitraum]} als CSV herunterladen`}
          className="text-muted"
        >
          <Download className="h-4 w-4" />
        </Link>
      </div>
      <p className="mt-1 text-2xl font-semibold">{formatPreis(summe)}</p>
      <p className="mt-0.5 text-xs text-muted">{anzahl} Tisch{anzahl === 1 ? '' : 'e'} abgerechnet</p>
    </div>
  )
}
