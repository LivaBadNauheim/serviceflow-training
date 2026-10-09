import { getServiceClient } from '@/lib/supabase/server'
import { monatsKey, tagesKey, wochenKey } from '@/lib/zeit'

export type GeschlosseneSession = {
  id: string
  tischId: number
  summe: number
  geschlossenAt: Date
}

export async function ladeGeschlosseneSessions(limit = 2000): Promise<GeschlosseneSession[]> {
  const supabase = getServiceClient()

  const { data } = await supabase
    .from('tisch_sessions')
    .select('id, tisch_id, geschlossen_at, summe')
    .eq('status', 'geschlossen')
    .order('geschlossen_at', { ascending: false })
    .limit(limit)

  return (data ?? []).map((s) => ({
    id: s.id as string,
    tischId: s.tisch_id as number,
    summe: Number(s.summe),
    geschlossenAt: new Date(s.geschlossen_at as string),
  }))
}

export type Zeitraum = 'tag' | 'woche' | 'monat'

export const ZEITRAUM_LABEL: Record<Zeitraum, string> = {
  tag: 'Heute',
  woche: 'Diese Woche',
  monat: 'Dieser Monat',
}

export type VerkaufteArtikelZeile = { name: string; preis: number; menge: number }

// Fasst die Bestellpositionen abgerechneter Tische zu einer Verkaufsstatistik
// zusammen (z. B. "20x Espresso"). Gruppiert nach Name UND Preis, weil ein
// Artikel mit Extras (z. B. "Cappuccino (Hafer)") einen eigenen Preis hat
// und deshalb als eigene Zeile sinnvoller ist als zusammengemischt.
export async function ladeVerkaufteArtikel(sessionIds: string[]): Promise<VerkaufteArtikelZeile[]> {
  if (sessionIds.length === 0) return []

  const supabase = getServiceClient()
  const { data } = await supabase.from('bestellpositionen').select('name, preis, menge').in('session_id', sessionIds)

  const nachArtikel = new Map<string, VerkaufteArtikelZeile>()
  for (const p of data ?? []) {
    const name = p.name as string
    const preis = Number(p.preis)
    const key = `${name}|${preis}`
    const bisher = nachArtikel.get(key)
    if (bisher) {
      bisher.menge += Number(p.menge)
    } else {
      nachArtikel.set(key, { name, preis, menge: Number(p.menge) })
    }
  }

  return Array.from(nachArtikel.values()).sort((a, b) => b.menge - a.menge)
}

export function filterZeitraum(sessions: GeschlosseneSession[], zeitraum: Zeitraum): GeschlosseneSession[] {
  const jetzt = new Date()

  if (zeitraum === 'tag') {
    const heute = tagesKey(jetzt)
    return sessions.filter((s) => tagesKey(s.geschlossenAt) === heute)
  }

  if (zeitraum === 'woche') {
    const dieseWoche = wochenKey(jetzt)
    return sessions.filter((s) => wochenKey(s.geschlossenAt) === dieseWoche)
  }

  const dieserMonat = monatsKey(jetzt)
  return sessions.filter((s) => monatsKey(s.geschlossenAt) === dieserMonat)
}
