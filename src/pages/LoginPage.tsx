import { LoginForm } from '@/features/auth'

export function LoginPage() {
  return (
    <div className="w-full max-w-sm">
      {/* Card */}
      <div className="bg-[var(--color-bg-card)] rounded-[var(--radius-card)] shadow-[var(--shadow-panel)] p-8 flex flex-col gap-8">

        {/* Brand */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="w-11 h-11 rounded-[var(--radius-icon-btn)] bg-[var(--color-text-primary)] flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <h1 className="text-[22px] font-bold text-[var(--color-text-primary)] tracking-tight">
            Jewellery IDMS
          </h1>
          <p className="text-sm text-[var(--color-text-muted)]">
            Sign in to your account
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  )
}
