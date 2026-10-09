import { notFound } from 'next/navigation'
import { getRolle } from '@/lib/session'
import { getServiceClient } from '@/lib/supabase/server'
import { tischOeffnen } from '@/app/actions'
import { items } from '@/lib/menu-data'
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

  const { data: positionen } = await supabase
    .from('bestellpositionen')
    .select('id, name, preis')
    .eq('session_id', sessionId)
    .order('erstellt_at')

  return (
    <Kasse
      tischName={tisch.name}
      sessionId={sessionId}
      rolle={rolle!}
      anfangsPositionen={(positionen ?? []).map((p) => ({ ...p, preis: Number(p.preis) }))}
      items={items}
    />
  )
}
