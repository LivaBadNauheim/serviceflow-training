import AppHeader from '@/components/AppHeader'
import { getRolle } from '@/lib/session'
import { ladeKatalog } from '@/lib/katalog'
import ArtikelVerwaltung from './ArtikelVerwaltung'

export const dynamic = 'force-dynamic'

export default async function ArtikelPage() {
  const rolle = await getRolle()
  const gruppen = await ladeKatalog()

  return (
    <div className="flex min-h-dvh flex-col">
      <AppHeader titel="Artikel" rolle={rolle!} zurueck="/admin" />
      <ArtikelVerwaltung anfangsGruppen={gruppen} />
    </div>
  )
}
