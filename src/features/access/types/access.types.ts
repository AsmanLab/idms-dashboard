export type AccessRequestStatus = 'pending' | 'approved' | 'declined' | 'info_requested'
export type RiskLevel = 'low' | 'medium' | 'high'
export type ResourceType = 'app' | 'zone' | 'system'

export interface Requestor {
  id: string
  name: string
  username: string
  department: string
  avatarUrl?: string
}

export interface AccessResource {
  name: string
  type: ResourceType
  protocol?: 'BLE' | 'NFC' | 'OIDC' | 'SAML' | 'FIDO2'
}

export interface AuditEntry {
  id: string
  timestamp: string // ISO 8601
  action: string    // human-readable
  actor: string
  note?: string
}

export interface AccessRequest {
  id: string
  requestedBy: Requestor
  resource: AccessResource
  reason: string
  requestedAt: string // ISO 8601
  status: AccessRequestStatus
  riskLevel: RiskLevel
  requiresDualSignoff: boolean
  dualSignoffApprover?: string
  infoRequestedMessage?: string
  infoRequestedAt?: string
  resolvedAt?: string
  resolvedBy?: string
  declineReason?: string
  auditTrail: AuditEntry[]
}
