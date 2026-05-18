import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useLoginMutation } from '../hooks/useLoginMutation'
import { parseApiError } from '@/lib/parseApiError'

const schema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
})

type FormValues = z.infer<typeof schema>

const inputClass =
  'w-full rounded-[var(--radius-input)] bg-[var(--color-bg-input)] border border-[var(--color-border)] px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] outline-none focus:border-[var(--color-accent-purple)] focus:ring-2 focus:ring-[var(--color-accent-purple)]/20 transition-all'

const inputErrorClass =
  'w-full rounded-[var(--radius-input)] bg-[var(--color-bg-input)] border border-[var(--color-accent-red)]/60 px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] outline-none focus:border-[var(--color-accent-red)] focus:ring-2 focus:ring-[var(--color-accent-red)]/20 transition-all'

export function LoginForm() {
  const { mutate: login, isPending, error } = useLoginMutation()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = (data: FormValues) => login(data)

  const apiError = error ? parseApiError(error) : null

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      {/* Username */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">
          Username
        </label>
        <input
          type="text"
          autoComplete="username"
          placeholder="Enter your username"
          {...register('username')}
          className={errors.username ? inputErrorClass : inputClass}
        />
        {errors.username && (
          <span className="text-xs text-[var(--color-accent-red)]">{errors.username.message}</span>
        )}
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">
          Password
        </label>
        <input
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          {...register('password')}
          className={errors.password ? inputErrorClass : inputClass}
        />
        {errors.password && (
          <span className="text-xs text-[var(--color-accent-red)]">{errors.password.message}</span>
        )}
      </div>

      {/* API error banner */}
      {apiError && (
        <div className="flex items-start gap-3 rounded-[var(--radius-input)] bg-[var(--color-accent-red)]/10 border border-[var(--color-accent-red)]/30 px-4 py-3">
          <svg className="mt-0.5 shrink-0 text-[var(--color-accent-red)]" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span className="text-sm text-[var(--color-text-primary)]">{apiError}</span>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-[var(--radius-btn)] bg-[var(--color-text-primary)] text-white font-medium py-3 text-sm transition-opacity hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed mt-1"
      >
        {isPending ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
            Signing in…
          </span>
        ) : (
          'Sign in'
        )}
      </button>
    </form>
  )
}
