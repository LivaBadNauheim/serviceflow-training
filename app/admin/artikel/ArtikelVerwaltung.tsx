'use client'

import { useState, useTransition } from 'react'
import { ChevronLeft, Pencil, Plus, Trash2 } from 'lucide-react'
import {
  artikelAktualisieren,
  artikelAnlegen,
  artikelLoeschen,
  extraAktualisieren,
  extraAnlegen,
  extraLoeschen,
  gruppeAnlegen,
  gruppeLoeschen,
  gruppeUmbenennen,
} from './actions'
import type { ArtikelGruppe } from '@/lib/katalog'
import { cn, formatPreis } from '@/lib/utils'

type Ansicht = 'gruppen' | 'artikel' | 'extras'

// Eine Zeile für Gruppe, Artikel oder Extra – jeweils mit Umbenennen/
// Bearbeiten (Stift) und zweistufigem Löschen (wie bei den Belegen im
// Finanzbereich). `preis` weglassen = reine Namenszeile (Artikelgruppen).
function VerwaltungsZeile({
  name,
  preis,
  onOeffnen,
  onSpeichern,
  onLoeschen,
}: {
  name: string
  preis?: number
  onOeffnen?: () => void
  onSpeichern: (name: string, preis: number) => void
  onLoeschen: () => void
}) {
  const [bearbeiten, setBearbeiten] = useState(false)
  const [bestaetigen, setBestaetigen] = useState(false)
  const [nameWert, setNameWert] = useState(name)
  const [preisWert, setPreisWert] = useState(preis !== undefined ? String(preis).replace('.', ',') : '')

  if (bearbeiten) {
    return (
      <li className="flex items-center gap-2 py-2">
        <input
          value={nameWert}
          onChange={(e) => setNameWert(e.target.value)}
          className="flex-1 rounded-lg border border-border bg-background px-2 py-1.5 text-sm"
        />
        {preis !== undefined && (
          <input
            value={preisWert}
            onChange={(e) => setPreisWert(e.target.value)}
            inputMode="decimal"
            className="w-16 rounded-lg border border-border bg-background px-2 py-1.5 text-sm"
          />
        )}
        <button onClick={() => setBearbeiten(false)} className="text-xs text-muted">
          Abbrechen
        </button>
        <button
          onClick={() => {
            const n = nameWert.trim()
            if (!n) return
            const p = preis !== undefined ? Number(preisWert.replace(',', '.')) : 0
            if (preis !== undefined && !Number.isFinite(p)) return
            onSpeichern(n, p)
            setBearbeiten(false)
          }}
          className="rounded-lg bg-accent px-2.5 py-1.5 text-xs font-medium text-accent-foreground"
        >
          Speichern
        </button>
      </li>
    )
  }

  return (
    <li className="flex items-center justify-between gap-2 py-2 text-sm">
      {onOeffnen ? (
        <button onClick={onOeffnen} className="flex-1 text-left">
          <span>{name}</span>
          {preis !== undefined && <span className="ml-2 text-muted">{formatPreis(preis)}</span>}
        </button>
      ) : (
        <span className="flex-1">
          {name}
          {preis !== undefined && <span className="ml-2 text-muted">{formatPreis(preis)}</span>}
        </span>
      )}

      {bestaetigen ? (
        <div className="flex items-center gap-2">
          <button onClick={() => setBestaetigen(false)} className="text-xs text-muted">
            Abbrechen
          </button>
          <button
            onClick={onLoeschen}
            className="rounded-lg bg-danger px-2.5 py-1.5 text-xs font-medium text-white"
          >
            Löschen
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-3 text-muted">
          <button onClick={() => setBearbeiten(true)} aria-label="Bearbeiten">
            <Pencil className="h-4 w-4" />
          </button>
          <button onClick={() => setBestaetigen(true)} aria-label="Löschen">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )}
    </li>
  )
}

function NeuEintrag({
  platzhalterName,
  mitPreis,
  onAnlegen,
  pending,
}: {
  platzhalterName: string
  mitPreis: boolean
  onAnlegen: (name: string, preis: number) => void
  pending: boolean
}) {
  const [name, setName] = useState('')
  const [preis, setPreis] = useState('')

  function anlegen() {
    const n = name.trim()
    if (!n) return
    const p = mitPreis ? Number(preis.replace(',', '.') || '0') : 0
    if (mitPreis && !Number.isFinite(p)) return
    onAnlegen(n, p)
    setName('')
    setPreis('')
  }

  return (
    <div className="mt-3 flex gap-2">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={platzhalterName}
        className="flex-1 rounded-xl border border-border bg-card px-3 py-2 text-sm"
      />
      {mitPreis && (
        <input
          value={preis}
          onChange={(e) => setPreis(e.target.value)}
          placeholder="Preis"
          inputMode="decimal"
          className="w-20 rounded-xl border border-border bg-card px-3 py-2 text-sm"
        />
      )}
      <button
        onClick={anlegen}
        disabled={pending}
        className="flex items-center justify-center rounded-xl bg-accent px-3 py-2 text-accent-foreground disabled:opacity-40"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  )
}

export default function ArtikelVerwaltung({ anfangsGruppen }: { anfangsGruppen: ArtikelGruppe[] }) {
  const [gruppen, setGruppen] = useState<ArtikelGruppe[]>(anfangsGruppen)
  const [gruppeTyp, setGruppeTyp] = useState<'essen' | 'trinken'>('essen')
  const [ansicht, setAnsicht] = useState<Ansicht>('gruppen')
  const [aktiveGruppeId, setAktiveGruppeId] = useState<string | null>(null)
  const [aktiverArtikelId, setAktiverArtikelId] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const [fehler, setFehler] = useState<string | null>(null)

  const sichtbareGruppen = gruppen.filter((g) => g.gruppe === gruppeTyp)
  const aktiveGruppe = gruppen.find((g) => g.id === aktiveGruppeId) ?? null
  const aktiverArtikel = aktiveGruppe?.artikel.find((a) => a.id === aktiverArtikelId) ?? null

  function gruppeWechseln(neu: 'essen' | 'trinken') {
    setGruppeTyp(neu)
    setAnsicht('gruppen')
    setAktiveGruppeId(null)
    setAktiverArtikelId(null)
  }

  function gruppeErstellen(name: string) {
    setFehler(null)
    startTransition(async () => {
      try {
        const neu = await gruppeAnlegen(gruppeTyp, name)
        setGruppen((prev) => [...prev, { ...neu, artikel: [] }])
      } catch (e) {
        setFehler(e instanceof Error ? e.message : 'Gruppe konnte nicht angelegt werden')
      }
    })
  }

  function gruppeRename(id: string, name: string) {
    setGruppen((prev) => prev.map((g) => (g.id === id ? { ...g, name } : g)))
    startTransition(() => gruppeUmbenennen(id, name))
  }

  function gruppeEntfernen(id: string) {
    setGruppen((prev) => prev.filter((g) => g.id !== id))
    if (aktiveGruppeId === id) {
      setAnsicht('gruppen')
      setAktiveGruppeId(null)
    }
    startTransition(() => gruppeLoeschen(id))
  }

  function artikelErstellen(name: string, preis: number) {
    if (!aktiveGruppeId) return
    setFehler(null)
    startTransition(async () => {
      try {
        const neu = await artikelAnlegen(aktiveGruppeId, name, preis)
        setGruppen((prev) =>
          prev.map((g) => (g.id === aktiveGruppeId ? { ...g, artikel: [...g.artikel, neu] } : g))
        )
      } catch (e) {
        setFehler(e instanceof Error ? e.message : 'Artikel konnte nicht angelegt werden')
      }
    })
  }

  function artikelSpeichern(id: string, name: string, preis: number) {
    setGruppen((prev) =>
      prev.map((g) =>
        g.id !== aktiveGruppeId
          ? g
          : { ...g, artikel: g.artikel.map((a) => (a.id === id ? { ...a, name, preis } : a)) }
      )
    )
    startTransition(() => artikelAktualisieren(id, name, preis))
  }

  function artikelEntfernen(id: string) {
    setGruppen((prev) =>
      prev.map((g) => (g.id !== aktiveGruppeId ? g : { ...g, artikel: g.artikel.filter((a) => a.id !== id) }))
    )
    if (aktiverArtikelId === id) {
      setAnsicht('artikel')
      setAktiverArtikelId(null)
    }
    startTransition(() => artikelLoeschen(id))
  }

  function extraErstellen(name: string, aufpreis: number) {
    if (!aktiverArtikelId) return
    setFehler(null)
    startTransition(async () => {
      try {
        const neu = await extraAnlegen(aktiverArtikelId, name, aufpreis)
        setGruppen((prev) =>
          prev.map((g) =>
            g.id !== aktiveGruppeId
              ? g
              : {
                  ...g,
                  artikel: g.artikel.map((a) =>
                    a.id === aktiverArtikelId ? { ...a, extras: [...a.extras, neu] } : a
                  ),
                }
          )
        )
      } catch (e) {
        setFehler(e instanceof Error ? e.message : 'Extra konnte nicht angelegt werden')
      }
    })
  }

  function extraSpeichern(id: string, name: string, aufpreis: number) {
    setGruppen((prev) =>
      prev.map((g) =>
        g.id !== aktiveGruppeId
          ? g
          : {
              ...g,
              artikel: g.artikel.map((a) =>
                a.id !== aktiverArtikelId
                  ? a
                  : { ...a, extras: a.extras.map((e) => (e.id === id ? { ...e, name, aufpreis } : e)) }
              ),
            }
      )
    )
    startTransition(() => extraAktualisieren(id, name, aufpreis))
  }

  function extraEntfernen(id: string) {
    setGruppen((prev) =>
      prev.map((g) =>
        g.id !== aktiveGruppeId
          ? g
          : {
              ...g,
              artikel: g.artikel.map((a) =>
                a.id !== aktiverArtikelId ? a : { ...a, extras: a.extras.filter((e) => e.id !== id) }
              ),
            }
      )
    )
    startTransition(() => extraLoeschen(id))
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex gap-2 border-b border-border px-4 py-2">
        {(['essen', 'trinken'] as const).map((g) => (
          <button
            key={g}
            onClick={() => gruppeWechseln(g)}
            className={cn(
              'rounded-full px-4 py-1.5 text-sm font-medium',
              gruppeTyp === g ? 'bg-accent text-accent-foreground' : 'bg-card text-muted'
            )}
          >
            {g === 'essen' ? 'Essen' : 'Getränke'}
          </button>
        ))}
      </div>

      {ansicht !== 'gruppen' && (
        <button
          onClick={() => setAnsicht(ansicht === 'extras' ? 'artikel' : 'gruppen')}
          className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-muted"
        >
          <ChevronLeft className="h-4 w-4" />
          {ansicht === 'extras' ? aktiverArtikel?.name : 'Artikelgruppen'}
        </button>
      )}

      <div className="flex-1 overflow-y-auto px-4 py-2">
        {fehler && <p className="mb-2 text-sm text-danger">{fehler}</p>}

        {ansicht === 'gruppen' && (
          <>
            <ul className="divide-y divide-border rounded-2xl bg-card px-3">
              {sichtbareGruppen.length === 0 && (
                <li className="py-3 text-sm text-muted">Noch keine Artikelgruppen.</li>
              )}
              {sichtbareGruppen.map((g) => (
                <VerwaltungsZeile
                  key={g.id}
                  name={g.name}
                  onOeffnen={() => {
                    setAktiveGruppeId(g.id)
                    setAnsicht('artikel')
                  }}
                  onSpeichern={(name) => gruppeRename(g.id, name)}
                  onLoeschen={() => gruppeEntfernen(g.id)}
                />
              ))}
            </ul>
            <NeuEintrag
              platzhalterName="Neue Artikelgruppe"
              mitPreis={false}
              pending={pending}
              onAnlegen={gruppeErstellen}
            />
          </>
        )}

        {ansicht === 'artikel' && aktiveGruppe && (
          <>
            <ul className="divide-y divide-border rounded-2xl bg-card px-3">
              {aktiveGruppe.artikel.length === 0 && (
                <li className="py-3 text-sm text-muted">Noch keine Artikel in dieser Gruppe.</li>
              )}
              {aktiveGruppe.artikel.map((a) => (
                <VerwaltungsZeile
                  key={a.id}
                  name={a.name}
                  preis={a.preis}
                  onOeffnen={() => {
                    setAktiverArtikelId(a.id)
                    setAnsicht('extras')
                  }}
                  onSpeichern={(name, preis) => artikelSpeichern(a.id, name, preis)}
                  onLoeschen={() => artikelEntfernen(a.id)}
                />
              ))}
            </ul>
            <NeuEintrag
              platzhalterName="Neuer Artikel"
              mitPreis
              pending={pending}
              onAnlegen={artikelErstellen}
            />
          </>
        )}

        {ansicht === 'extras' && aktiverArtikel && (
          <>
            <p className="mb-2 text-xs text-muted">
              Zusatzoptionen für {aktiverArtikel.name} (z. B. Milchalternativen, Sirup) – wie bei den
              Kaffee-Getränken.
            </p>
            <ul className="divide-y divide-border rounded-2xl bg-card px-3">
              {aktiverArtikel.extras.length === 0 && (
                <li className="py-3 text-sm text-muted">Noch keine Extras für diesen Artikel.</li>
              )}
              {aktiverArtikel.extras.map((e) => (
                <VerwaltungsZeile
                  key={e.id}
                  name={e.name}
                  preis={e.aufpreis}
                  onSpeichern={(name, aufpreis) => extraSpeichern(e.id, name, aufpreis)}
                  onLoeschen={() => extraEntfernen(e.id)}
                />
              ))}
            </ul>
            <NeuEintrag
              platzhalterName="Neues Extra (z. B. Hafer)"
              mitPreis
              pending={pending}
              onAnlegen={extraErstellen}
            />
          </>
        )}
      </div>
    </div>
  )
}
