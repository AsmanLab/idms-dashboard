import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useLoginMutation } from '../hooks/useLoginMutation'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type FormValues = z.infer<typeof schema>

export function LoginForm() {
  const { mutate: login, isPending, error } = useLoginMutation()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = (data: FormValues) => login(data)

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">
          Email
        </label>
        <input
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          {...register('email')}
          className="w-full rounded-[var(--radius-input)] bg-[var(--color-bg-input)] border border-[var(--color-border)] px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] outline-none focus:border-[var(--color-accent-purple)] focus:ring-2 focus:ring-[var(--color-accent-purple)]/20 transition-all"
        />
        {errors.email && (
          <span className="text-xs text-[var(--color-accent-red)]">{errors.email.message}</span>
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
          className="w-full rounded-[var(--radius-input)] bg-[var(--color-bg-input)] border border-[var(--color-border)] px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] outline-none focus:border-[var(--color-accent-purple)] focus:ring-2 focus:ring-[var(--color-accent-purple)]/20 transition-all"
        />
        {errors.password && (
          <span className="text-xs text-[var(--color-accent-red)]">{errors.password.message}</span>
        )}
      </div>

      {/* API error */}
      {error && (
        <div className="rounded-[var(--radius-input)] bg-[var(--color-accent-red)]/20 border border-[var(--color-accent-red)]/40 px-4 py-3 text-sm text-[var(--color-text-primary)]">
          Invalid email or password. Please try again.
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-[var(--radius-btn)] bg-[var(--color-text-primary)] text-white font-medium py-3 text-sm transition-opacity hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed mt-1"
      >
        {isPending ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  )
}
