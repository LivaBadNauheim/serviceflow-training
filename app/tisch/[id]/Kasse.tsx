'use client'

import { useMemo, useState, useTransition } from 'react'
import { ChevronLeft, ChevronRight, Folder, Minus, Printer } from 'lucide-react'
import AppHeader from '@/components/AppHeader'
import {
  positionEntfernen,
  positionenBonnieren,
  positionHinzufuegen,
  positionStornieren,
  tischAbrechnen,
} from '@/app/actions'
import { druckeBon, druckerKonfiguriert } from '@/lib/eposPrint'
import type { Artikel, ArtikelGruppe } from '@/lib/katalog'
import type { Rolle } from '@/lib/auth'
import { cn, formatPreis } from '@/lib/utils'

type Position = { id: string; name: string; preis: number; bonniertAt: boolean }

// Farben für die Kategorie-Kacheln – rein optisch zur Wiedererkennung wie
// am echten Orderman, per Reihenfolge der Kategorie zugeordnet (keine
// feste Zuordnung pro Name nötig, damit neue Kategorien automatisch
// mitfarben).
const KATEGORIE_FARBEN = [
  { bg: 'bg-orange-500', text: 'text-white' },
  { bg: 'bg-emerald-600', text: 'text-white' },
  { bg: 'bg-sky-400', text: 'text-white' },
  { bg: 'bg-yellow-400', text: 'text-slate-900' },
  { bg: 'bg-purple-500', text: 'text-white' },
  { bg: 'bg-rose-500', text: 'text-white' },
  { bg: 'bg-blue-600', text: 'text-white' },
  { bg: 'bg-teal-600', text: 'text-white' },
  { bg: 'bg-lime-600', text: 'text-white' },
  { bg: 'bg-indigo-500', text: 'text-white' },
]

type Ansicht = 'kategorien' | 'items' | 'extras'

export default function Kasse({
  tischName,
  sessionId,
  rolle,
  anfangsPositionen,
  gruppen,
}: {
  tischName: string
  sessionId: string
  rolle: Rolle
  anfangsPositionen: Position[]
  gruppen: ArtikelGruppe[]
}) {
  const [gruppe, setGruppe] = useState<'essen' | 'trinken'>('essen')
  const [ansicht, setAnsicht] = useState<Ansicht>('kategorien')
  const [aktiveKategorieId, setAktiveKategorieId] = useState<string | null>(null)
  const [aktivesItem, setAktivesItem] = useState<Artikel | null>(null)
  const [ausgewaehlteExtras, setAusgewaehlteExtras] = useState<Set<string>>(new Set())
  const [kommentar, setKommentar] = useState('')

  const [positionen, setPositionen] = useState<Position[]>(anfangsPositionen)
  const [pending, startTransition] = useTransition()
  const [abrechnenPending, startAbrechnen] = useTransition()
  const [bonnierenPending, startBonnieren] = useTransition()
  const [bonnierenFehler, setBonnierenFehler] = useState<string | null>(null)
  const [stornierenBestaetigenId, setStornierenBestaetigenId] = useState<string | null>(null)

  const kategorien = useMemo(() => gruppen.filter((g) => g.gruppe === gruppe), [gruppe, gruppen])

  const aktiveKategorie = useMemo(
    () => kategorien.find((k) => k.id === aktiveKategorieId) ?? null,
    [kategorien, aktiveKategorieId]
  )

  const summe = positionen.reduce((acc, p) => acc + p.preis, 0)

  function gruppeWechseln(neu: 'essen' | 'trinken') {
    setGruppe(neu)
    setAnsicht('kategorien')
    setAktiveKategorieId(null)
  }

  function kategorieOeffnen(kategorieId: string) {
    setAktiveKategorieId(kategorieId)
    setAnsicht('items')
  }

  function hinzufuegen(name: string, preis: number) {
    startTransition(async () => {
      const row = await positionHinzufuegen(sessionId, name, preis, gruppe)
      setPositionen((prev) => [...prev, { ...row, bonniertAt: false }])
    })
  }

  function extrasOeffnen(item: Artikel) {
    setAktivesItem(item)
    setAusgewaehlteExtras(new Set())
    setKommentar('')
    setAnsicht('extras')
  }

  function extraUmschalten(name: string) {
    setAusgewaehlteExtras((prev) => {
      const neu = new Set(prev)
      if (neu.has(name)) neu.delete(name)
      else neu.add(name)
      return neu
    })
  }

  function mitExtrasAufnehmen() {
    if (!aktivesItem) return
    const gewaehlteExtras = aktivesItem.extras.filter((e) => ausgewaehlteExtras.has(e.name))
    const preis = aktivesItem.preis + gewaehlteExtras.reduce((acc, e) => acc + e.aufpreis, 0)
    const zusatz = gewaehlteExtras.map((e) => e.name).join(', ')
    const name = [aktivesItem.name, zusatz && `(${zusatz})`, kommentar.trim() && `– ${kommentar.trim()}`]
      .filter(Boolean)
      .join(' ')

    hinzufuegen(name, preis)
    setAnsicht('items')
    setAktivesItem(null)
  }

  function entfernen(positionId: string) {
    setPositionen((prev) => prev.filter((p) => p.id !== positionId))
    startTransition(async () => {
      await positionEntfernen(positionId, sessionId)
    })
  }

  function stornieren(positionId: string) {
    setPositionen((prev) => prev.filter((p) => p.id !== positionId))
    setStornierenBestaetigenId(null)
    startTransition(async () => {
      await positionStornieren(positionId, sessionId)
    })
  }

  function bonnieren() {
    setBonnierenFehler(null)
    startBonnieren(async () => {
      try {
        const neue = await positionenBonnieren(sessionId)
        if (neue.length === 0) {
          setBonnierenFehler('Keine neuen Positionen zum Bonnieren')
          return
        }
        setPositionen((prev) => prev.map((p) => (p.bonniertAt ? p : { ...p, bonniertAt: true })))
        await druckeBon(tischName, neue)
      } catch (e) {
        setBonnierenFehler(e instanceof Error ? e.message : 'Bonnieren fehlgeschlagen')
      }
    })
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <AppHeader titel={tischName} rolle={rolle} zurueck="/tische" />

      <div className="flex gap-2 border-b border-border px-4 py-2">
        {(['essen', 'trinken'] as const).map((g) => (
          <button
            key={g}
            onClick={() => gruppeWechseln(g)}
            className={cn(
              'rounded-full px-4 py-1.5 text-sm font-medium',
              gruppe === g ? 'bg-accent text-accent-foreground' : 'bg-card text-muted'
            )}
          >
            {g === 'essen' ? 'Essen' : 'Getränke'}
          </button>
        ))}
      </div>

      {ansicht !== 'kategorien' && (
        <button
          onClick={() => setAnsicht(ansicht === 'extras' ? 'items' : 'kategorien')}
          className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-muted"
        >
          <ChevronLeft className="h-4 w-4" />
          {ansicht === 'extras' ? aktiveKategorie?.name : 'Kategorien'}
        </button>
      )}

      <div className="flex-1 overflow-y-auto px-4 py-3">
        {ansicht === 'kategorien' && (
          <div className="grid grid-cols-3 gap-2">
            {kategorien.map((kategorie, i) => {
              const farbe = KATEGORIE_FARBEN[i % KATEGORIE_FARBEN.length]
              return (
                <button
                  key={kategorie.id}
                  onClick={() => kategorieOeffnen(kategorie.id)}
                  className={cn(
                    'flex aspect-square flex-col items-center justify-center gap-1 rounded-xl p-2 text-center text-sm font-medium active:scale-95',
                    farbe.bg,
                    farbe.text
                  )}
                >
                  <Folder className="h-5 w-5 opacity-80" />
                  {kategorie.name}
                </button>
              )
            })}
          </div>
        )}

        {ansicht === 'items' && aktiveKategorie && (
          <div className="grid grid-cols-2 gap-2">
            {aktiveKategorie.artikel.map((item) =>
              item.extras.length > 0 ? (
                <div key={item.id} className="flex overflow-hidden rounded-xl border border-border">
                  <button
                    onClick={() => hinzufuegen(item.name, item.preis)}
                    disabled={pending}
                    className="flex flex-[2] flex-col items-start justify-center gap-0.5 bg-card px-3 py-2.5 text-left active:bg-border disabled:opacity-60"
                  >
                    <span className="text-sm leading-tight">{item.name}</span>
                    <span className="text-sm font-medium">{formatPreis(item.preis)}</span>
                  </button>
                  <button
                    onClick={() => extrasOeffnen(item)}
                    aria-label={`${item.name} anpassen`}
                    className="flex w-11 flex-none items-center justify-center bg-accent text-accent-foreground active:opacity-80"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <button
                  key={item.id}
                  disabled={pending}
                  onClick={() => hinzufuegen(item.name, item.preis)}
                  className="flex flex-col items-start justify-center gap-0.5 rounded-xl bg-card px-3 py-2.5 text-left active:bg-border disabled:opacity-60"
                >
                  <span className="text-sm leading-tight">{item.name}</span>
                  <span className="text-sm font-medium">{formatPreis(item.preis)}</span>
                </button>
              )
            )}
          </div>
        )}

        {ansicht === 'extras' && aktivesItem && (
          <div>
            <h2 className="mb-1 text-lg font-semibold">{aktivesItem.name}</h2>
            <p className="mb-4 text-sm text-muted">{formatPreis(aktivesItem.preis)}</p>

            <div className="grid grid-cols-3 gap-2">
              {aktivesItem.extras.map((extra) => (
                <button
                  key={extra.name}
                  onClick={() => extraUmschalten(extra.name)}
                  className={cn(
                    'flex flex-col items-center justify-center gap-0.5 rounded-xl border px-2 py-3 text-center text-sm',
                    ausgewaehlteExtras.has(extra.name)
                      ? 'border-accent bg-accent text-accent-foreground'
                      : 'border-border bg-card'
                  )}
                >
                  <span>{extra.name}</span>
                  <span className="text-xs opacity-80">
                    {extra.aufpreis > 0 ? `+ ${formatPreis(extra.aufpreis)}` : formatPreis(0)}
                  </span>
                </button>
              ))}
            </div>

            <label className="mt-4 block text-sm text-muted">
              Kommentar
              <input
                type="text"
                value={kommentar}
                onChange={(e) => setKommentar(e.target.value)}
                placeholder="z. B. ohne Zucker"
                className="mt-1 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground"
              />
            </label>

            <button
              disabled={pending}
              onClick={mitExtrasAufnehmen}
              className="mt-5 w-full rounded-2xl bg-accent py-3.5 text-base font-semibold text-accent-foreground disabled:opacity-40"
            >
              Aufnehmen
            </button>
          </div>
        )}
      </div>

      {ansicht !== 'extras' && (
        <div className="max-h-[32dvh] overflow-y-auto border-t border-border bg-card px-4 py-2">
          {positionen.length === 0 ? (
            <p className="py-2 text-center text-sm text-muted">Noch nichts gebucht</p>
          ) : (
            <ul className="space-y-1">
              {positionen.map((p) => (
                <li key={p.id} className="flex items-center justify-between py-1">
                  <span className="text-sm">{p.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">{formatPreis(p.preis)}</span>
                    {p.bonniertAt ? (
                      stornierenBestaetigenId === p.id ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setStornierenBestaetigenId(null)}
                            className="text-xs text-muted"
                          >
                            Abbrechen
                          </button>
                          <button
                            onClick={() => stornieren(p.id)}
                            className="rounded-lg bg-danger px-2 py-1 text-xs font-medium text-white"
                          >
                            Stornieren
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setStornierenBestaetigenId(p.id)}
                          className="text-xs font-medium text-danger"
                        >
                          Stornieren
                        </button>
                      )
                    ) : (
                      <button onClick={() => entfernen(p.id)} aria-label="Entfernen" className="text-muted">
                        <Minus className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {ansicht !== 'extras' && (
        <div className="border-t border-border bg-background p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium text-muted">Summe</span>
            <span className="text-xl font-semibold">{formatPreis(summe)}</span>
          </div>

          {druckerKonfiguriert() && (
            <>
              <button
                disabled={positionen.length === 0 || bonnierenPending}
                onClick={bonnieren}
                className="mb-2 flex w-full items-center justify-center gap-2 rounded-2xl border border-border py-3.5 text-sm font-semibold text-foreground disabled:opacity-40"
              >
                <Printer className="h-4 w-4" />
                {bonnierenPending ? 'Bonniere…' : 'Bonnieren'}
              </button>
              {bonnierenFehler && (
                <p className="mb-2 text-center text-xs text-danger">{bonnierenFehler}</p>
              )}
            </>
          )}

          <button
            disabled={positionen.length === 0 || abrechnenPending}
            onClick={() => startAbrechnen(() => tischAbrechnen(sessionId))}
            className="w-full rounded-2xl bg-accent py-4 text-base font-semibold text-accent-foreground disabled:opacity-40"
          >
            {abrechnenPending ? 'Schließe…' : 'Tisch abrechnen'}
          </button>
        </div>
      )}
    </div>
  )
}
