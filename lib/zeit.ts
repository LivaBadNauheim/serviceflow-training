// Alle Abschlüsse in Europe/Berlin rechnen, nicht in Server-UTC – sonst
// verschieben sich Tagesgrenzen rund um Mitternacht.
const TZ = 'Europe/Berlin'

function teileInBerlin(date: Date) {
  const parts = new Intl.DateTimeFormat('de-DE', {
    timeZone: TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)

  const get = (type: string) => Number(parts.find((p) => p.type === type)!.value)
  return { jahr: get('year'), monat: get('month'), tag: get('day') }
}

export function tagesKey(date: Date): string {
  const { jahr, monat, tag } = teileInBerlin(date)
  return `${jahr}-${String(monat).padStart(2, '0')}-${String(tag).padStart(2, '0')}`
}

export function monatsKey(date: Date): string {
  const { jahr, monat } = teileInBerlin(date)
  return `${jahr}-${String(monat).padStart(2, '0')}`
}

export function wochenKey(date: Date): string {
  const { jahr, monat, tag } = teileInBerlin(date)
  const d = new Date(Date.UTC(jahr, monat - 1, tag))
  const tagNr = (d.getUTCDay() + 6) % 7
  d.setUTCDate(d.getUTCDate() - tagNr + 3)
  const ersterDonnerstag = new Date(Date.UTC(d.getUTCFullYear(), 0, 4))
  const wochenNr =
    1 +
    Math.round(
      ((d.getTime() - ersterDonnerstag.getTime()) / 86400000 -
        3 +
        ((ersterDonnerstag.getUTCDay() + 6) % 7)) /
        7
    )
  return `${d.getUTCFullYear()}-W${String(wochenNr).padStart(2, '0')}`
}
