// Bonnieren-Druck über Epson ePOS-Print – läuft komplett im Browser des
// Handys, direkt ans lokale Netz (nicht über unseren Server bei Vercel,
// der hat keinen Zugriff auf das WLAN vor Ort). Funktioniert deshalb
// gleich auf iPhone und Android, ganz ohne Bluetooth-Pairing.
//
// Der Bon ist ein Küchenbon, kein Rechnungsbeleg: Gericht/Getränk und
// Tischnummer gut lesbar, der Zeitstempel bewusst klein/unauffällig –
// Preise stehen bewusst nicht drauf.
//
// Zwei physische Drucker wie im echten Betrieb: Theke (Getränke) und
// Küche (Essen). Ein einziger Bonnieren-Knopf im Interface – die Zuordnung
// zum richtigen Drucker läuft automatisch über die Gruppe jeder Position.
//
// Setup/Hintergrund siehe README – insbesondere der Mixed-Content-Punkt
// (unsere Seite läuft über HTTPS, der Drucker standardmäßig nur über
// HTTP im lokalen Netz).

const ZEILENBREITE = 48 // Zeichen pro Zeile bei 80mm-Papier, Schrift A – ggf. anpassen

const DRUCKER_LABEL = { essen: 'Küche', trinken: 'Theke' } as const

function xmlEscape(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function trennlinie(): string {
  return '-'.repeat(ZEILENBREITE)
}

function druckerIp(gruppe: 'essen' | 'trinken'): string | undefined {
  return gruppe === 'essen'
    ? process.env.NEXT_PUBLIC_DRUCKER_IP_ESSEN
    : process.env.NEXT_PUBLIC_DRUCKER_IP_GETRAENKE
}

export type BonPosition = { name: string; menge: number; gruppe: 'essen' | 'trinken' }

export function buildBonXml(tischName: string, positionen: { name: string; menge: number }[]): string {
  const zeitstempel = new Date().toLocaleString('de-DE', {
    timeZone: 'Europe/Berlin',
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })

  const zeilen: string[] = [
    `<text align="center" width="2" height="2">${xmlEscape(tischName)}&#10;</text>`,
    `<text>${trennlinie()}&#10;</text>`,
    ...positionen.map((p) => {
      const bezeichnung = p.menge > 1 ? `${p.menge}x ${p.name}` : p.name
      return `<text align="center" em="true">${xmlEscape(bezeichnung)}&#10;</text>`
    }),
    `<text>${trennlinie()}&#10;</text>`,
    `<text align="center" em="false">${xmlEscape(zeitstempel)}&#10;</text>`,
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
  return Boolean(process.env.NEXT_PUBLIC_DRUCKER_IP_ESSEN || process.env.NEXT_PUBLIC_DRUCKER_IP_GETRAENKE)
}

async function sendeAnDrucker(ip: string, xml: string): Promise<void> {
  const protokoll = process.env.NEXT_PUBLIC_DRUCKER_HTTPS === 'true' ? 'https' : 'http'

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
    throw new Error(`Drucker ${ip} antwortete mit Status ${antwort.status}`)
  }
}

export async function druckeBon(tischName: string, positionen: BonPosition[]): Promise<void> {
  const fehler: string[] = []

  for (const gruppe of ['essen', 'trinken'] as const) {
    const gefiltert = positionen.filter((p) => p.gruppe === gruppe)
    if (gefiltert.length === 0) continue

    const ip = druckerIp(gruppe)
    if (!ip) {
      fehler.push(`${DRUCKER_LABEL[gruppe]}-Drucker nicht konfiguriert`)
      continue
    }

    try {
      await sendeAnDrucker(ip, buildBonXml(tischName, gefiltert))
    } catch (e) {
      const meldung = e instanceof Error ? e.message : 'unbekannter Fehler'
      fehler.push(`${DRUCKER_LABEL[gruppe]}-Drucker: ${meldung}`)
    }
  }

  if (fehler.length > 0) {
    throw new Error(fehler.join(' / '))
  }
}
