import AppHeader from '@/components/AppHeader'
import { getRolle } from '@/lib/session'
import { getServiceClient } from '@/lib/supabase/server'
import Tischuebersicht from './Tischuebersicht'

export const dynamic = 'force-dynamic'

async function ladeTische() {
  const supabase = getServiceClient()

  const { data: tische } = await supabase.from('tische').select('id, name, bereich').order('id')
  const { data: offeneSessions } = await supabase
    .from('tisch_sessions')
    .select('tisch_id, summe')
    .eq('status', 'offen')

  const summenNachTisch = new Map((offeneSessions ?? []).map((s) => [s.tisch_id, Number(s.summe)]))

  return (tische ?? []).map((t) => ({
    id: t.id,
    name: t.name,
    bereich: t.bereich as 'drinnen' | 'terrasse',
    belegt: summenNachTisch.has(t.id),
    summe: summenNachTisch.get(t.id) ?? 0,
  }))
}

export default async function TischuebersichtPage() {
  const rolle = await getRolle()
  const tische = await ladeTische()

  return (
    <div className="flex min-h-dvh flex-col">
      <AppHeader titel="Tische" rolle={rolle!} />
      <Tischuebersicht tische={tische} />
    </div>
  )
}
