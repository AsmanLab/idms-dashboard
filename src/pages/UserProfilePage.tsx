import { useParams, Link } from 'react-router-dom'
import { useProfileQuery } from '@/features/profile/hooks/useProfileQuery'
import { ProfileHeader, ProfileHeaderSkeleton } from '@/features/profile/components/ProfileHeader'
import { CredentialCard, CredentialCardSkeleton } from '@/features/profile/components/CredentialCard'
import { AccessSummary } from '@/features/profile/components/AccessSummary'
import { AccessEvents } from '@/features/profile/components/AccessEvents'
import { SecuritySettings } from '@/features/profile/components/SecuritySettings'
import { parseApiError } from '@/lib/parseApiError'

export function UserProfilePage() {
  const { username } = useParams<{ username: string }>()
  const { data: profile, isLoading, isError, error } = useProfileQuery(username ?? '')

  return (
    <div className="px-8 py-8 max-w-4xl mx-auto flex flex-col gap-6">
      <Link
        to="/users"
        className="flex items-center gap-1.5 text-sm font-medium w-fit transition-opacity hover:opacity-70"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back to users
      </Link>

      {isError ? (
        <div
          className="flex items-center gap-2 p-4 text-sm"
          style={{
            backgroundColor: 'var(--color-bg-card)',
            color: 'var(--color-accent-red)',
            boxShadow: 'var(--shadow-card)',
            borderRadius: 'var(--radius-btn)',
          }}
          role="alert"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {parseApiError(error)}
        </div>
      ) : isLoading ? (
        <>
          <ProfileHeaderSkeleton />
          <CredentialCardSkeleton />
        </>
      ) : profile ? (
        <>
          <ProfileHeader profile={profile} />
          <CredentialCard identityId={profile.id} />
          <AccessSummary identityId={profile.id} />
          <AccessEvents identityId={profile.id} />
          <SecuritySettings identityId={profile.id} />
        </>
      ) : null}
    </div>
  )
}
