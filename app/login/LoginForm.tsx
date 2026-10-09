'use client'

import { useActionState, useState } from 'react'
import { Delete } from 'lucide-react'
import { login } from '@/app/actions'
import { cn } from '@/lib/utils'

const initialState = { fehler: undefined as string | undefined }

export default function LoginForm() {
  const [pin, setPin] = useState('')
  const [state, formAction, pending] = useActionState(async () => {
    const formData = new FormData()
    formData.set('pin', pin)
    return login(formData)
  }, initialState)

  const tasten = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del']

  return (
    <form action={formAction} className="space-y-6">
      <div className="flex justify-center gap-3">
        {Array.from({ length: Math.max(pin.length, 4) }).map((_, i) => (
          <span
            key={i}
            className={cn(
              'h-3.5 w-3.5 rounded-full border-2 border-accent',
              i < pin.length ? 'bg-accent' : 'bg-transparent'
            )}
          />
        ))}
      </div>

      {state?.fehler && <p className="text-sm font-medium text-danger">{state.fehler}</p>}

      <div className="grid grid-cols-3 gap-3">
        {tasten.map((taste, i) =>
          taste === '' ? (
            <div key={i} />
          ) : taste === 'del' ? (
            <button
              key={i}
              type="button"
              onClick={() => setPin((p) => p.slice(0, -1))}
              className="flex h-16 items-center justify-center rounded-2xl bg-card text-foreground active:bg-border"
            >
              <Delete className="h-5 w-5" />
            </button>
          ) : (
            <button
              key={i}
              type="button"
              onClick={() => setPin((p) => (p.length < 8 ? p + taste : p))}
              className="h-16 rounded-2xl bg-card text-xl font-medium text-foreground active:bg-border"
            >
              {taste}
            </button>
          )
        )}
      </div>

      <button
        type="submit"
        disabled={pending || pin.length === 0}
        className="w-full rounded-2xl bg-accent py-4 text-base font-semibold text-accent-foreground disabled:opacity-40"
      >
        {pending ? 'Prüfe…' : 'Anmelden'}
      </button>
    </form>
  )
}
