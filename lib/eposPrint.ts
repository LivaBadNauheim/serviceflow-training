// Belegdruck über Epson ePOS-Print – läuft komplett im Browser des
// Handys, direkt ans lokale Netz (nicht über unseren Server bei Vercel,
// der hat keinen Zugriff auf das WLAN vor Ort). Funktioniert deshalb
// gleich auf iPhone und Android, ganz ohne Bluetooth-Pairing.
//
// Setup/Hintergrund siehe README – insbesondere der Mixed-Content-Punkt
// (unsere Seite läuft über HTTPS, der Drucker standardmäßig nur über
// HTTP im lokalen Netz).

const ZEILENBREITE = 48 // Zeichen pro Zeile bei 80mm-Papier, Schrift A – ggf. anpassen

function xmlEscape(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function zeile(links: string, rechts: string): string {
  const platz = Math.max(1, ZEILENBREITE - links.length - rechts.length)
  return xmlEscape(links) + ' '.repeat(platz) + xmlEscape(rechts)
}

function trennlinie(): string {
  return '-'.repeat(ZEILENBREITE)
}

function formatPreis(wert: number): string {
  return wert.toFixed(2).replace('.', ',') + ' EUR'
}

export type DruckPosition = { name: string; preis: number }

export function buildBelegXml(tischName: string, positionen: DruckPosition[], summe: number): string {
  const zeilen: string[] = [
    `<text align="center" width="2" height="2">LIVA KASSENTRAINING&#10;</text>`,
    `<text align="center">${xmlEscape(tischName)}&#10;</text>`,
    `<text>${trennlinie()}&#10;</text>`,
    ...positionen.map((p) => `<text>${zeile(p.name, formatPreis(p.preis))}&#10;</text>`),
    `<text>${trennlinie()}&#10;</text>`,
    `<text width="2" height="2">${zeile('Summe', formatPreis(summe))}&#10;</text>`,
    `<feed line="3"/>`,
    `<cut type="feed"/>`,
  ]

  return `<?xml version="1.0" encoding="utf-8"?>
<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
  <s:Body>
    <epos-print xmlns="http://www.epson-pos.com/schemas/2011/03/epos-print">
      ${zeilen.join('\n      ')}
    </epos-print>
  </s:Body>
</s:Envelope>`
}

export function druckerKonfiguriert(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_DRUCKER_IP)
}

export async function druckeBeleg(
  tischName: string,
  positionen: DruckPosition[],
  summe: number
): Promise<void> {
  const ip = process.env.NEXT_PUBLIC_DRUCKER_IP
  if (!ip) {
    throw new Error('Keine Drucker-IP konfiguriert (NEXT_PUBLIC_DRUCKER_IP)')
  }

  const protokoll = process.env.NEXT_PUBLIC_DRUCKER_HTTPS === 'true' ? 'https' : 'http'
  const xml = buildBelegXml(tischName, positionen, summe)

  const antwort = await fetch(
    `${protokoll}://${ip}/cgi-bin/epos/service.cgi?devid=local_printer&timeout=10000`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        SOAPAction: '""',
      },
      body: xml,
    }
  )

  if (!antwort.ok) {
    throw new Error(`Drucker antwortete mit Status ${antwort.status}`)
  }
}
