'use server'

import { revalidatePath } from 'next/cache'
import { getServiceClient } from '@/lib/supabase/server'

export async function gruppeAnlegen(gruppe: 'essen' | 'trinken', name: string) {
  const supabase = getServiceClient()

  const { data: letzte } = await supabase
    .from('artikel_gruppen')
    .select('sortierung')
    .eq('gruppe', gruppe)
    .order('sortierung', { ascending: false })
    .limit(1)
    .maybeSingle()

  const { data, error } = await supabase
    .from('artikel_gruppen')
    .insert({ gruppe, name: name.trim(), sortierung: (letzte?.sortierung ?? -1) + 1 })
    .select('id, gruppe, name')
    .single()

  if (error || !data) throw new Error(error?.message ?? 'Gruppe konnte nicht angelegt werden')

  revalidatePath('/admin/artikel')
  return data as { id: string; gruppe: 'essen' | 'trinken'; name: string }
}

export async function gruppeUmbenennen(id: string, name: string) {
  const supabase = getServiceClient()
  const { error } = await supabase.from('artikel_gruppen').update({ name: name.trim() }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/artikel')
}

export async function gruppeLoeschen(id: string) {
  const supabase = getServiceClient()
  const { error } = await supabase.from('artikel_gruppen').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/artikel')
}

export async function artikelAnlegen(gruppenId: string, name: string, preis: number) {
  const supabase = getServiceClient()

  const { data: letzter } = await supabase
    .from('artikel')
    .select('sortierung')
    .eq('gruppen_id', gruppenId)
    .order('sortierung', { ascending: false })
    .limit(1)
    .maybeSingle()

  const { data, error } = await supabase
    .from('artikel')
    .insert({ gruppen_id: gruppenId, name: name.trim(), preis, sortierung: (letzter?.sortierung ?? -1) + 1 })
    .select('id, name, preis')
    .single()

  if (error || !data) throw new Error(error?.message ?? 'Artikel konnte nicht angelegt werden')

  revalidatePath('/admin/artikel')
  return { id: data.id as string, name: data.name as string, preis: Number(data.preis), extras: [] }
}

export async function artikelAktualisieren(id: string, name: string, preis: number) {
  const supabase = getServiceClient()
  const { error } = await supabase.from('artikel').update({ name: name.trim(), preis }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/artikel')
}

export async function artikelLoeschen(id: string) {
  const supabase = getServiceClient()
  const { error } = await supabase.from('artikel').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/artikel')
}

export async function extraAnlegen(artikelId: string, name: string, aufpreis: number) {
  const supabase = getServiceClient()

  const { data: letztes } = await supabase
    .from('artikel_extras')
    .select('sortierung')
    .eq('artikel_id', artikelId)
    .order('sortierung', { ascending: false })
    .limit(1)
    .maybeSingle()

  const { data, error } = await supabase
    .from('artikel_extras')
    .insert({ artikel_id: artikelId, name: name.trim(), aufpreis, sortierung: (letztes?.sortierung ?? -1) + 1 })
    .select('id, name, aufpreis')
    .single()

  if (error || !data) throw new Error(error?.message ?? 'Extra konnte nicht angelegt werden')

  revalidatePath('/admin/artikel')
  return { id: data.id as string, name: data.name as string, aufpreis: Number(data.aufpreis) }
}

export async function extraAktualisieren(id: string, name: string, aufpreis: number) {
  const supabase = getServiceClient()
  const { error } = await supabase.from('artikel_extras').update({ name: name.trim(), aufpreis }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/artikel')
}

export async function extraLoeschen(id: string) {
  const supabase = getServiceClient()
  const { error } = await supabase.from('artikel_extras').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/artikel')
}
