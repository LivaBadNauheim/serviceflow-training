// Artikel-Katalog aus der Datenbank (Tabellen artikel_gruppen/artikel/
// artikel_extras, siehe Migration 0004/0005). Ersetzt die frühere statische
// lib/menu-data.ts – der Admin pflegt den Katalog jetzt direkt in der App
// unter /admin/artikel.

import { getServiceClient } from '@/lib/supabase/server'

export type Extra = { id: string; name: string; aufpreis: number }
export type Artikel = { id: string; name: string; preis: number; extras: Extra[] }
export type ArtikelGruppe = {
  id: string
  gruppe: 'essen' | 'trinken'
  name: string
  artikel: Artikel[]
}

export async function ladeKatalog(): Promise<ArtikelGruppe[]> {
  const supabase = getServiceClient()

  const [{ data: gruppen }, { data: artikel }, { data: extras }] = await Promise.all([
    supabase.from('artikel_gruppen').select('id, gruppe, name, sortierung').order('sortierung'),
    supabase.from('artikel').select('id, gruppen_id, name, preis, sortierung').order('sortierung'),
    supabase.from('artikel_extras').select('id, artikel_id, name, aufpreis, sortierung').order('sortierung'),
  ])

  const extrasNachArtikel = new Map<string, Extra[]>()
  for (const e of extras ?? []) {
    const liste = extrasNachArtikel.get(e.artikel_id as string) ?? []
    liste.push({ id: e.id as string, name: e.name as string, aufpreis: Number(e.aufpreis) })
    extrasNachArtikel.set(e.artikel_id as string, liste)
  }

  const artikelNachGruppe = new Map<string, Artikel[]>()
  for (const a of artikel ?? []) {
    const liste = artikelNachGruppe.get(a.gruppen_id as string) ?? []
    liste.push({
      id: a.id as string,
      name: a.name as string,
      preis: Number(a.preis),
      extras: extrasNachArtikel.get(a.id as string) ?? [],
    })
    artikelNachGruppe.set(a.gruppen_id as string, liste)
  }

  return (gruppen ?? []).map((g) => ({
    id: g.id as string,
    gruppe: g.gruppe as 'essen' | 'trinken',
    name: g.name as string,
    artikel: artikelNachGruppe.get(g.id as string) ?? [],
  }))
}
