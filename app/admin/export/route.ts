import { NextRequest } from 'next/server'
import * as XLSX from 'xlsx'
import { getServiceClient } from '@/lib/supabase/server'
import { filterZeitraum, ladeGeschlosseneSessions, type Zeitraum } from '@/lib/finanzen'
import { tagesKey } from '@/lib/zeit'

export async function GET(request: NextRequest) {
  const zeitraumParam = request.nextUrl.searchParams.get('zeitraum')
  const zeitraum: Zeitraum = zeitraumParam === 'woche' || zeitraumParam === 'monat' ? zeitraumParam : 'tag'

  const [sessions, supabase] = [await ladeGeschlosseneSessions(), getServiceClient()]
  const gefiltert = filterZeitraum(sessions, zeitraum)

  const { data: tische } = await supabase.from('tische').select('id, bereich')
  const bereichNachTisch = new Map((tische ?? []).map((t) => [t.id as number, t.bereich as string]))

  const zeilen: (string | number)[][] = [['Tisch', 'Bereich', 'Datum', 'Uhrzeit', 'Summe (EUR)']]

  for (const s of gefiltert) {
    zeilen.push([
      `Tisch ${s.tischId}`,
      bereichNachTisch.get(s.tischId) ?? '',
      s.geschlossenAt.toLocaleDateString('de-DE', { timeZone: 'Europe/Berlin' }),
      s.geschlossenAt.toLocaleTimeString('de-DE', { timeZone: 'Europe/Berlin', hour: '2-digit', minute: '2-digit' }),
      s.summe,
    ])
  }

  const gesamt = gefiltert.reduce((acc, s) => acc + s.summe, 0)
  zeilen.push(['', '', '', 'Gesamt', gesamt])

  const blatt = XLSX.utils.aoa_to_sheet(zeilen)
  blatt['!cols'] = [{ wch: 10 }, { wch: 10 }, { wch: 12 }, { wch: 10 }, { wch: 14 }]

  for (let zeile = 2; zeile <= zeilen.length; zeile++) {
    const zelle = blatt[`E${zeile}`]
    if (zelle) zelle.z = '#,##0.00 €'
  }

  const arbeitsmappe = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(arbeitsmappe, blatt, 'Abschluss')

  const buffer = XLSX.write(arbeitsmappe, { type: 'buffer', bookType: 'xlsx' }) as Buffer
  const dateiname = `abschluss-${zeitraum}-${tagesKey(new Date())}.xlsx`

  return new Response(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${dateiname}"`,
    },
  })
}

export const dynamic = 'force-dynamic'
