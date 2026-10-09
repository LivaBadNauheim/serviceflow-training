'use client'

import { useState } from 'react'
import { CalendarRange, Download } from 'lucide-react'

export default function ZeitraumExport() {
  const heute = new Date().toISOString().slice(0, 10)
  const [von, setVon] = useState(heute)
  const [bis, setBis] = useState(heute)

  return (
    <div className="rounded-2xl bg-card p-4">
      <div className="mb-2 flex items-center gap-2 text-sm text-muted">
        <CalendarRange className="h-4 w-4" />
        Eigener Zeitraum (z. B. ein Tag in der Vergangenheit)
      </div>

      <div className="flex items-center gap-2">
        <input
          type="date"
          value={von}
          max={heute}
          onChange={(e) => setVon(e.target.value)}
          className="flex-1 rounded-xl border border-border bg-background px-2 py-2 text-sm"
        />
        <span className="text-xs text-muted">bis</span>
        <input
          type="date"
          value={bis}
          min={von}
          max={heute}
          onChange={(e) => setBis(e.target.value)}
          className="flex-1 rounded-xl border border-border bg-background px-2 py-2 text-sm"
        />
      </div>

      <a
        href={`/admin/export?von=${von}&bis=${bis}`}
        className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-accent py-2.5 text-sm font-semibold text-accent-foreground active:opacity-80"
      >
        <Download className="h-4 w-4" />
        Als Excel herunterladen
      </a>
    </div>
  )
}
