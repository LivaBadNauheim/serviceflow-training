'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createSessionToken, pruefePin, SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from '@/lib/auth'
import { getServiceClient } from '@/lib/supabase/server'

export async function login(formData: FormData): Promise<{ fehler?: string }> {
  const pin = String(formData.get('pin') ?? '')
  const rolle = pruefePin(pin)

  if (!rolle) {
    return { fehler: 'Falscher PIN' }
  }

  const token = await createSessionToken(rolle)
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: '/',
  })

  redirect('/tische')
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
  redirect('/login')
}

export async function tischOeffnen(tischId: number) {
  const supabase = getServiceClient()

  const { data: bestehend } = await supabase
    .from('tisch_sessions')
    .select('id')
    .eq('tisch_id', tischId)
    .eq('status', 'offen')
    .maybeSingle()

  if (bestehend) return bestehend.id as string

  const { data, error } = await supabase
    .from('tisch_sessions')
    .insert({ tisch_id: tischId })
    .select('id')
    .single()

  if (error || !data) throw new Error(error?.message ?? 'Tisch konnte nicht geöffnet werden')
  return data.id as string
}

export async function positionHinzufuegen(
  sessionId: string,
  name: string,
  preis: number,
  gruppe: 'essen' | 'trinken'
) {
  const supabase = getServiceClient()

  const { data, error } = await supabase
    .from('bestellpositionen')
    .insert({ session_id: sessionId, name, preis, gruppe })
    .select('id, name, preis')
    .single()

  if (error || !data) throw new Error(error?.message ?? 'Position konnte nicht hinzugefügt werden')

  await summeAktualisieren(sessionId)

  return data as { id: string; name: string; preis: number }
}

export async function positionEntfernen(positionId: string, sessionId: string) {
  const supabase = getServiceClient()

  const { data: position } = await supabase
    .from('bestellpositionen')
    .select('bonniert_at')
    .eq('id', positionId)
    .single()

  if (position?.bonniert_at) {
    throw new Error('Bereits bonnierte Positionen können nur noch storniert werden')
  }

  const { error } = await supabase.from('bestellpositionen').delete().eq('id', positionId)
  if (error) throw new Error(error.message)

  await summeAktualisieren(sessionId)
}

// Einmal bonniert (Küche/Theke hat die Position schon gesehen), lässt sich
// eine Position nicht mehr einfach löschen – nur noch stornieren. Die Zeile
// bleibt als Beleg erhalten und zählt nicht mehr in die Tischsumme, taucht
// aber im Admin-Export als Stornierung auf.
export async function positionStornieren(positionId: string, sessionId: string) {
  const supabase = getServiceClient()

  const { error } = await supabase
    .from('bestellpositionen')
    .update({ storniert_at: new Date().toISOString() })
    .eq('id', positionId)

  if (error) throw new Error(error.message)

  await summeAktualisieren(sessionId)
}

async function summeAktualisieren(sessionId: string) {
  const supabase = getServiceClient()

  const { data: positionen } = await supabase
    .from('bestellpositionen')
    .select('preis, menge')
    .eq('session_id', sessionId)
    .is('storniert_at', null)

  const summe = (positionen ?? []).reduce((acc, p) => acc + Number(p.preis) * p.menge, 0)

  await supabase.from('tisch_sessions').update({ summe }).eq('id', sessionId)
}

export async function positionenBonnieren(sessionId: string) {
  const supabase = getServiceClient()

  const { data: offene, error: selectError } = await supabase
    .from('bestellpositionen')
    .select('id, name, menge, gruppe')
    .eq('session_id', sessionId)
    .is('bonniert_at', null)

  if (selectError) throw new Error(selectError.message)
  if (!offene || offene.length === 0) return []

  const { error: updateError } = await supabase
    .from('bestellpositionen')
    .update({ bonniert_at: new Date().toISOString() })
    .in(
      'id',
      offene.map((p) => p.id)
    )

  if (updateError) throw new Error(updateError.message)

  return offene.map((p) => ({
    name: p.name as string,
    menge: p.menge as number,
    gruppe: p.gruppe as 'essen' | 'trinken',
  }))
}

export async function tischAbrechnen(sessionId: string) {
  const supabase = getServiceClient()

  const { error } = await supabase
    .from('tisch_sessions')
    .update({ status: 'geschlossen', geschlossen_at: new Date().toISOString() })
    .eq('id', sessionId)

  if (error) throw new Error(error.message)

  redirect('/tische')
}

export async function belegLoeschen(sessionId: string) {
  const supabase = getServiceClient()

  const { error } = await supabase.from('tisch_sessions').delete().eq('id', sessionId)
  if (error) throw new Error(error.message)

  revalidatePath('/admin')
}
