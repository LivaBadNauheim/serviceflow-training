import { notFound } from 'next/navigation'
import { getRolle } from '@/lib/session'
import { getServiceClient } from '@/lib/supabase/server'
import { tischOeffnen } from '@/app/actions'
import { ladeKatalog } from '@/lib/katalog'
import Kasse from './Kasse'

export const dynamic = 'force-dynamic'

export default async function TischPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const tischId = Number(id)
  if (!Number.isInteger(tischId)) notFound()

  const rolle = await getRolle()
  const supabase = getServiceClient()

  const { data: tisch } = await supabase.from('tische').select('id, name').eq('id', tischId).maybeSingle()
  if (!tisch) notFound()

  const sessionId = await tischOeffnen(tischId)

  const [{ data: positionen }, gruppen] = await Promise.all([
    supabase
      .from('bestellpositionen')
      .select('id, name, preis, bonniert_at')
      .eq('session_id', sessionId)
      .is('storniert_at', null)
      .order('erstellt_at'),
    ladeKatalog(),
  ])

  return (
    <Kasse
      tischName={tisch.name}
      sessionId={sessionId}
      rolle={rolle!}
      anfangsPositionen={(positionen ?? []).map((p) => ({
        id: p.id,
        name: p.name,
        preis: Number(p.preis),
        bonniertAt: p.bonniert_at !== null,
      }))}
      gruppen={gruppen}
    />
  )
}
