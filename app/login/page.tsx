import LoginForm from './LoginForm'

export default function LoginPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6">
      <div className="w-full max-w-xs space-y-8 text-center">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Kassentraining</h1>
          <p className="mt-1 text-sm text-muted">PIN eingeben zum Anmelden</p>
        </div>
        <LoginForm />
      </div>
    </main>
  )
}
