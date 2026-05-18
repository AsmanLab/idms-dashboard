import api from '@/services/api'
import type {
  UserProfile,
  Credential,
  AccessSummary,
  AccessEvent,
  IdentitySettings,
} from '../types/profile.types'

// Flip to false when the real API is ready
const USE_MOCK = true

function nameFromUsername(username: string): string {
  return username
    .replace(/[._-]/g, ' ')
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

function mockProfile(username: string): UserProfile {
  const name = nameFromUsername(username)
  const hash = username.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  return {
    id: 'mock-identity-001',
    username,
    name,
    employeeId: `EMP-${String(hash).padStart(5, '0').slice(-5)}`,
    title: 'Senior Software Engineer',
    department: 'Engineering',
    status: 'active',
  }
}

const MOCK_CREDENTIAL: Credential = {
  id: 'CRED-20241',
  status: 'active',
  protocols: ['BLE', 'NFC', 'FIDO2'],
  deviceName: 'iPhone 15 Pro',
  enrolledAt: '2024-09-15T10:30:00.000Z',
}

const MOCK_ACCESS_SUMMARY: AccessSummary = {
  totalZones: 12,
  totalApps: 7,
  zones: [
    { id: 'z1', name: 'Main Office Floor 3', floor: 'Floor 3', accessLevel: 'Full Access' },
    { id: 'z2', name: 'Server Room A', floor: 'Basement', accessLevel: 'Read Only' },
    { id: 'z3', name: 'R&D Lab', floor: 'Floor 5', accessLevel: 'Full Access' },
    { id: 'z4', name: 'Executive Suite', floor: 'Floor 8', accessLevel: 'Escort Required' },
    { id: 'z5', name: 'Canteen', floor: 'Ground', accessLevel: 'Full Access' },
    { id: 'z6', name: 'Parking Garage', floor: 'Basement', accessLevel: 'Full Access' },
    { id: 'z7', name: 'Rooftop Access', floor: 'Roof', accessLevel: 'Restricted' },
  ],
  apps: [
    { id: 'a1', name: 'GitHub Enterprise', protocol: 'SAML', lastLogin: '2025-05-17T09:12:00.000Z' },
    { id: 'a2', name: 'Google Workspace', protocol: 'OIDC', lastLogin: '2025-05-18T08:45:00.000Z' },
    { id: 'a3', name: 'Jira Cloud', protocol: 'SAML', lastLogin: '2025-05-16T14:30:00.000Z' },
    { id: 'a4', name: 'Figma', protocol: 'OIDC', lastLogin: '2025-05-15T11:00:00.000Z' },
    { id: 'a5', name: 'AWS Console', protocol: 'SAML', lastLogin: '2025-05-14T16:22:00.000Z' },
    { id: 'a6', name: 'Notion', protocol: 'OIDC', lastLogin: '2025-05-13T10:05:00.000Z' },
    { id: 'a7', name: 'Datadog', protocol: 'SAML', lastLogin: '2025-05-10T09:55:00.000Z' },
  ],
}

const MOCK_EVENTS: AccessEvent[] = [
  { id: 'e1',  timestamp: '2025-05-18T09:15:00.000Z', resource: 'Main Office Floor 3', resourceType: 'door', protocol: 'BLE',   result: 'granted' },
  { id: 'e2',  timestamp: '2025-05-18T09:01:00.000Z', resource: 'Google Workspace',    resourceType: 'app',  protocol: 'OIDC',  result: 'granted' },
  { id: 'e3',  timestamp: '2025-05-17T18:30:00.000Z', resource: 'Parking Garage',      resourceType: 'door', protocol: 'NFC',   result: 'granted' },
  { id: 'e4',  timestamp: '2025-05-17T14:05:00.000Z', resource: 'Executive Suite',     resourceType: 'door', protocol: 'BLE',   result: 'denied'  },
  { id: 'e5',  timestamp: '2025-05-17T13:45:00.000Z', resource: 'GitHub Enterprise',   resourceType: 'app',  protocol: 'SAML',  result: 'granted' },
  { id: 'e6',  timestamp: '2025-05-17T11:20:00.000Z', resource: 'R&D Lab',             resourceType: 'door', protocol: 'FIDO2', result: 'granted' },
  { id: 'e7',  timestamp: '2025-05-17T10:00:00.000Z', resource: 'Server Room A',       resourceType: 'door', protocol: 'NFC',   result: 'denied'  },
  { id: 'e8',  timestamp: '2025-05-16T16:55:00.000Z', resource: 'AWS Console',         resourceType: 'app',  protocol: 'SAML',  result: 'granted' },
  { id: 'e9',  timestamp: '2025-05-16T14:30:00.000Z', resource: 'Jira Cloud',          resourceType: 'app',  protocol: 'SAML',  result: 'granted' },
  { id: 'e10', timestamp: '2025-05-16T09:10:00.000Z', resource: 'Main Office Floor 3', resourceType: 'door', protocol: 'BLE',   result: 'granted' },
  { id: 'e11', timestamp: '2025-05-15T17:40:00.000Z', resource: 'Rooftop Access',      resourceType: 'door', protocol: 'NFC',   result: 'denied'  },
  { id: 'e12', timestamp: '2025-05-15T11:00:00.000Z', resource: 'Figma',               resourceType: 'app',  protocol: 'OIDC',  result: 'granted' },
  { id: 'e13', timestamp: '2025-05-14T16:20:00.000Z', resource: 'AWS Console',         resourceType: 'app',  protocol: 'SAML',  result: 'granted' },
  { id: 'e14', timestamp: '2025-05-14T09:00:00.000Z', resource: 'Main Office Floor 3', resourceType: 'door', protocol: 'BLE',   result: 'granted' },
  { id: 'e15', timestamp: '2025-05-13T15:30:00.000Z', resource: 'R&D Lab',             resourceType: 'door', protocol: 'FIDO2', result: 'revoked' },
]

const MOCK_SETTINGS: IdentitySettings = {
  requireBiometric: true,
  allowOffline: false,
  notifyOnDenied: true,
}

function delay<T>(value: T, ms = 400): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

export const profileService = {
  getProfile: (username: string) =>
    USE_MOCK
      ? delay(mockProfile(username))
      : api.get<UserProfile>(`/users/${username}`).then((r) => r.data),

  updateProfile: (identityId: string, patch: { name?: string; department?: string }): Promise<UserProfile> =>
    USE_MOCK
      ? delay<UserProfile>({
          id: identityId,
          username: 'user',
          name: patch.name ?? 'User',
          employeeId: 'EMP-00000',
          title: 'Senior Software Engineer',
          department: patch.department ?? 'Engineering',
          status: 'active',
        })
      : api.patch<UserProfile>(`/identities/${identityId}`, patch).then((r) => r.data),

  getCredential: (_identityId: string) =>
    USE_MOCK
      ? delay(MOCK_CREDENTIAL)
      : api.get<Credential>(`/identities/${_identityId}/credential`).then((r) => r.data),

  revokeCredential: (_credentialId: string) =>
    USE_MOCK
      ? delay({ success: true })
      : api.post(`/credentials/${_credentialId}/revoke`).then((r) => r.data),

  getAccessSummary: (_identityId: string) =>
    USE_MOCK
      ? delay(MOCK_ACCESS_SUMMARY)
      : api.get<AccessSummary>(`/identities/${_identityId}/access`).then((r) => r.data),

  getAccessEvents: (_identityId: string) =>
    USE_MOCK
      ? delay(MOCK_EVENTS)
      : api.get<AccessEvent[]>(`/identities/${_identityId}/events`).then((r) => r.data),

  getSettings: (_identityId: string) =>
    USE_MOCK
      ? delay(MOCK_SETTINGS)
      : api.get<IdentitySettings>(`/identities/${_identityId}/settings`).then((r) => r.data),

  updateSettings: (_identityId: string, patch: Partial<IdentitySettings>) =>
    USE_MOCK
      ? delay({ ...MOCK_SETTINGS, ...patch })
      : api
          .patch<IdentitySettings>(`/identities/${_identityId}/settings`, patch)
          .then((r) => r.data),
}
