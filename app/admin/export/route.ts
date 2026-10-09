import { NextRequest } from 'next/server'
import { getServiceClient } from '@/lib/supabase/server'
import { filterZeitraum, ladeGeschlosseneSessions, type Zeitraum } from '@/lib/finanzen'
import { tagesKey } from '@/lib/zeit'

function csvPreis(wert: number): string {
  return wert.toFixed(2).replace('.', ',')
}

function csvFeld(wert: string): string {
  return `"${wert.replace(/"/g, '""')}"`
}

export async function GET(request: NextRequest) {
  const zeitraumParam = request.nextUrl.searchParams.get('zeitraum')
  const zeitraum: Zeitraum = zeitraumParam === 'woche' || zeitraumParam === 'monat' ? zeitraumParam : 'tag'

  const [sessions, supabase] = [await ladeGeschlosseneSessions(), getServiceClient()]
  const gefiltert = filterZeitraum(sessions, zeitraum)

  const { data: tische } = await supabase.from('tische').select('id, bereich')
  const bereichNachTisch = new Map((tische ?? []).map((t) => [t.id as number, t.bereich as string]))

  const zeilen = [['Tisch', 'Bereich', 'Datum', 'Uhrzeit', 'Summe (EUR)'].map(csvFeld).join(';')]

  for (const s of gefiltert) {
    zeilen.push(
      [
        csvFeld(`Tisch ${s.tischId}`),
        csvFeld(bereichNachTisch.get(s.tischId) ?? ''),
        csvFeld(s.geschlossenAt.toLocaleDateString('de-DE', { timeZone: 'Europe/Berlin' })),
        csvFeld(s.geschlossenAt.toLocaleTimeString('de-DE', { timeZone: 'Europe/Berlin', hour: '2-digit', minute: '2-digit' })),
        csvFeld(csvPreis(s.summe)),
      ].join(';')
    )
  }

  const gesamt = gefiltert.reduce((acc, s) => acc + s.summe, 0)
  zeilen.push(['', '', '', csvFeld('Gesamt'), csvFeld(csvPreis(gesamt))].join(';'))

  const csv = '﻿' + zeilen.join('\r\n') + '\r\n'
  const dateiname = `abschluss-${zeitraum}-${tagesKey(new Date())}.csv`

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${dateiname}"`,
    },
  })
}

export const dynamic = 'force-dynamic'
