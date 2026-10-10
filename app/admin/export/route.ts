import { NextRequest } from 'next/server'
import * as XLSX from 'xlsx'
import { getServiceClient } from '@/lib/supabase/server'
import {
  filterZeitraum,
  filterZeitraumBenutzerdefiniert,
  ladeGeschlosseneSessions,
  ladeStornierungen,
  ladeVerkaufteArtikel,
  type Zeitraum,
} from '@/lib/finanzen'
import { tagesKey } from '@/lib/zeit'

const DATUM_REGEX = /^\d{4}-\d{2}-\d{2}$/

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const von = params.get('von')
  const bis = params.get('bis')
  const eigenerZeitraum = von && bis && DATUM_REGEX.test(von) && DATUM_REGEX.test(bis) ? { von, bis } : null

  const zeitraumParam = params.get('zeitraum')
  const zeitraum: Zeitraum = zeitraumParam === 'woche' || zeitraumParam === 'monat' ? zeitraumParam : 'tag'

  const [sessions, supabase] = [await ladeGeschlosseneSessions(), getServiceClient()]
  const gefiltert = eigenerZeitraum
    ? filterZeitraumBenutzerdefiniert(sessions, eigenerZeitraum.von, eigenerZeitraum.bis)
    : filterZeitraum(sessions, zeitraum)

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

  const artikelZeilen: (string | number)[][] = [['Artikel', 'Menge', 'Einzelpreis (EUR)', 'Summe (EUR)']]
  const verkauft = await ladeVerkaufteArtikel(gefiltert.map((s) => s.id))

  for (const a of verkauft) {
    artikelZeilen.push([a.name, a.menge, a.preis, a.preis * a.menge])
  }

  const artikelGesamt = verkauft.reduce((acc, a) => acc + a.preis * a.menge, 0)
  artikelZeilen.push(['', '', 'Gesamt', artikelGesamt])

  const artikelBlatt = XLSX.utils.aoa_to_sheet(artikelZeilen)
  artikelBlatt['!cols'] = [{ wch: 32 }, { wch: 8 }, { wch: 16 }, { wch: 14 }]

  for (let zeile = 2; zeile <= artikelZeilen.length; zeile++) {
    const einzelpreis = artikelBlatt[`C${zeile}`]
    if (einzelpreis && typeof einzelpreis.v === 'number') einzelpreis.z = '#,##0.00 €'
    const summe = artikelBlatt[`D${zeile}`]
    if (summe) summe.z = '#,##0.00 €'
  }

  const stornoZeilen: (string | number)[][] = [['Tisch', 'Artikel', 'Zeitpunkt', 'Preis (EUR)']]
  const stornierungen = await ladeStornierungen(gefiltert)

  for (const s of stornierungen) {
    stornoZeilen.push([
      `Tisch ${s.tischId}`,
      s.name,
      s.storniertAt.toLocaleString('de-DE', {
        timeZone: 'Europe/Berlin',
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
      s.preis,
    ])
  }

  const stornoGesamt = stornierungen.reduce((acc, s) => acc + s.preis, 0)
  stornoZeilen.push(['', '', 'Gesamt', stornoGesamt])

  const stornoBlatt = XLSX.utils.aoa_to_sheet(stornoZeilen)
  stornoBlatt['!cols'] = [{ wch: 10 }, { wch: 32 }, { wch: 16 }, { wch: 14 }]

  for (let zeile = 2; zeile <= stornoZeilen.length; zeile++) {
    const preis = stornoBlatt[`D${zeile}`]
    if (preis) preis.z = '#,##0.00 €'
  }

  const arbeitsmappe = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(arbeitsmappe, blatt, 'Abschluss')
  XLSX.utils.book_append_sheet(arbeitsmappe, artikelBlatt, 'Verkaufte Artikel')
  XLSX.utils.book_append_sheet(arbeitsmappe, stornoBlatt, 'Stornierungen')

  const buffer = XLSX.write(arbeitsmappe, { type: 'buffer', bookType: 'xlsx' }) as Buffer
  const dateiTeil = eigenerZeitraum
    ? eigenerZeitraum.von === eigenerZeitraum.bis
      ? eigenerZeitraum.von
      : `${eigenerZeitraum.von}_bis_${eigenerZeitraum.bis}`
    : `${zeitraum}-${tagesKey(new Date())}`
  const dateiname = `abschluss-${dateiTeil}.xlsx`

  return new Response(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${dateiname}"`,
    },
  })
}

export const dynamic = 'force-dynamic'
