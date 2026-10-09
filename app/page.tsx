import { redirect } from 'next/navigation'
import { getRolle } from '@/lib/session'

export default async function RootPage() {
  const rolle = await getRolle()
  redirect(rolle ? '/tische' : '/login')
}
