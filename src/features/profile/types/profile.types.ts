export interface UserProfile {
  id: string
  username: string
  name: string
  employeeId: string
  title: string
  department: string
  status: 'active' | 'suspended' | 'offboarded'
  avatarUrl?: string
}

export interface Credential {
  id: string
  status: 'active' | 'revoked' | 'suspended'
  protocols: ('BLE' | 'NFC' | 'FIDO2')[]
  deviceName: string
  enrolledAt: string
}

export interface Zone {
  id: string
  name: string
  floor: string
  accessLevel: string
}

export interface ProvisionedApp {
  id: string
  name: string
  protocol: 'OIDC' | 'SAML'
  lastLogin: string
}

export interface AccessSummary {
  totalZones: number
  totalApps: number
  zones: Zone[]
  apps: ProvisionedApp[]
}

export interface AccessEvent {
  id: string
  timestamp: string
  resource: string
  resourceType: 'door' | 'app'
  protocol: 'BLE' | 'NFC' | 'OIDC' | 'SAML' | 'FIDO2'
  result: 'granted' | 'denied' | 'revoked'
}

export interface IdentitySettings {
  requireBiometric: boolean
  allowOffline: boolean
  notifyOnDenied: boolean
}
