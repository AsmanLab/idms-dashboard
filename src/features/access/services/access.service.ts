import api from '@/services/api'
import type { AccessRequest } from '../types/access.types'

const USE_MOCK = true

function delay<T>(data: T, ms: number): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms))
}

const MOCK_REQUESTS: AccessRequest[] = [
  {
    id: 'req-001',
    requestedBy: { id: 'u1', name: 'Asel Nurlanovna', username: 'asel.n', department: 'Engineering' },
    resource: { name: 'Server Room B', type: 'zone', protocol: 'BLE' },
    reason: 'Need physical access to Server Room B for the Q3 infrastructure migration. Will be running cable from rack 14 to rack 22 over the next two weeks.',
    requestedAt: '2025-05-18T08:30:00.000Z',
    status: 'pending',
    riskLevel: 'high',
    requiresDualSignoff: true,
    dualSignoffApprover: 'Timur Bekzatov',
    auditTrail: [
      { id: 'a1', timestamp: '2025-05-18T08:30:00.000Z', action: 'Request submitted', actor: 'Asel Nurlanovna' },
    ],
  },
  {
    id: 'req-002',
    requestedBy: { id: 'u2', name: 'Daniyal Serik', username: 'd.serik', department: 'Finance' },
    resource: { name: 'AWS Console', type: 'app', protocol: 'SAML' },
    reason: 'Need access to AWS Console to review billing dashboards and cost allocation tags for the Q2 financial close. Read-only access is sufficient.',
    requestedAt: '2025-05-18T07:15:00.000Z',
    status: 'pending',
    riskLevel: 'medium',
    requiresDualSignoff: false,
    auditTrail: [
      { id: 'a1', timestamp: '2025-05-18T07:15:00.000Z', action: 'Request submitted', actor: 'Daniyal Serik' },
    ],
  },
  {
    id: 'req-003',
    requestedBy: { id: 'u3', name: 'Madina Yusupova', username: 'madina.y', department: 'Design' },
    resource: { name: 'Figma Enterprise', type: 'app', protocol: 'OIDC' },
    reason: 'Upgrading from Figma Starter to Enterprise to access the shared component library maintained by the design system team.',
    requestedAt: '2025-05-17T16:45:00.000Z',
    status: 'pending',
    riskLevel: 'low',
    requiresDualSignoff: false,
    auditTrail: [
      { id: 'a1', timestamp: '2025-05-17T16:45:00.000Z', action: 'Request submitted', actor: 'Madina Yusupova' },
    ],
  },
  {
    id: 'req-004',
    requestedBy: { id: 'u4', name: 'Nurbol Akhmetov', username: 'n.akhmetov', department: 'Sales' },
    resource: { name: 'Executive Database', type: 'system' },
    reason: 'Required for the end-of-quarter revenue reconciliation report that I present to leadership.',
    requestedAt: '2025-05-17T14:00:00.000Z',
    status: 'info_requested',
    riskLevel: 'high',
    requiresDualSignoff: true,
    dualSignoffApprover: 'Arman Seitkali',
    infoRequestedMessage: 'Please provide the specific data fields you need access to, and confirm this has been approved by your direct manager.',
    infoRequestedAt: '2025-05-17T15:30:00.000Z',
    auditTrail: [
      { id: 'a1', timestamp: '2025-05-17T14:00:00.000Z', action: 'Request submitted', actor: 'Nurbol Akhmetov' },
      { id: 'a2', timestamp: '2025-05-17T15:30:00.000Z', action: 'Info requested', actor: 'Admin', note: 'Please provide the specific data fields you need access to, and confirm this has been approved by your direct manager.' },
    ],
  },
  {
    id: 'req-005',
    requestedBy: { id: 'u5', name: 'Aliya Bekova', username: 'aliya.b', department: 'HR' },
    resource: { name: 'Slack Enterprise Grid', type: 'app', protocol: 'SAML' },
    reason: 'Moving to the Enterprise Grid plan to support cross-workspace channels with our partner companies.',
    requestedAt: '2025-05-17T11:20:00.000Z',
    status: 'pending',
    riskLevel: 'low',
    requiresDualSignoff: false,
    auditTrail: [
      { id: 'a1', timestamp: '2025-05-17T11:20:00.000Z', action: 'Request submitted', actor: 'Aliya Bekova' },
    ],
  },
  {
    id: 'req-006',
    requestedBy: { id: 'u6', name: 'Ruslan Dzhaksybekov', username: 'ruslan.d', department: 'Engineering' },
    resource: { name: 'GitHub Enterprise', type: 'app', protocol: 'SAML' },
    reason: 'Joining the platform team and need access to the shared org repositories.',
    requestedAt: '2025-05-16T09:00:00.000Z',
    status: 'approved',
    riskLevel: 'low',
    requiresDualSignoff: false,
    resolvedAt: '2025-05-16T10:15:00.000Z',
    resolvedBy: 'Admin',
    auditTrail: [
      { id: 'a1', timestamp: '2025-05-16T09:00:00.000Z', action: 'Request submitted', actor: 'Ruslan Dzhaksybekov' },
      { id: 'a2', timestamp: '2025-05-16T10:15:00.000Z', action: 'Approved', actor: 'Admin' },
    ],
  },
  {
    id: 'req-007',
    requestedBy: { id: 'u7', name: 'Zarina Ospanova', username: 'zarina.o', department: 'Operations' },
    resource: { name: 'Production Server Room', type: 'zone', protocol: 'NFC' },
    reason: 'Need access for routine maintenance.',
    requestedAt: '2025-05-15T13:30:00.000Z',
    status: 'declined',
    riskLevel: 'high',
    requiresDualSignoff: true,
    dualSignoffApprover: 'Timur Bekzatov',
    resolvedAt: '2025-05-15T16:00:00.000Z',
    resolvedBy: 'Admin',
    declineReason: 'Insufficient justification for production server access. Please submit a change request via the CAB process and reapply after approval.',
    auditTrail: [
      { id: 'a1', timestamp: '2025-05-15T13:30:00.000Z', action: 'Request submitted', actor: 'Zarina Ospanova' },
      { id: 'a2', timestamp: '2025-05-15T16:00:00.000Z', action: 'Declined', actor: 'Admin', note: 'Insufficient justification for production server access. Please submit a change request via the CAB process and reapply after approval.' },
    ],
  },
]

export const accessService = {
  getRequests: (): Promise<AccessRequest[]> => {
    if (USE_MOCK) return delay([...MOCK_REQUESTS], 500)
    return api.get<AccessRequest[]>('/access/requests').then((r) => r.data)
  },

  getRequest: (id: string): Promise<AccessRequest> => {
    if (USE_MOCK) {
      const found = MOCK_REQUESTS.find((r) => r.id === id)
      if (!found) return Promise.reject(new Error(`Request ${id} not found`))
      return delay({ ...found }, 500)
    }
    return api.get<AccessRequest>(`/access/requests/${id}`).then((r) => r.data)
  },

  approveRequest: (id: string): Promise<AccessRequest> => {
    if (USE_MOCK) {
      const found = MOCK_REQUESTS.find((r) => r.id === id)
      if (!found) return Promise.reject(new Error(`Request ${id} not found`))
      const updated: AccessRequest = {
        ...found,
        status: 'approved',
        resolvedAt: new Date().toISOString(),
        resolvedBy: 'Admin',
        auditTrail: [
          ...found.auditTrail,
          { id: `a${found.auditTrail.length + 1}`, timestamp: new Date().toISOString(), action: 'Approved', actor: 'Admin' },
        ],
      }
      return delay(updated, 500)
    }
    return api.post<AccessRequest>(`/access/requests/${id}/approve`).then((r) => r.data)
  },

  declineRequest: (id: string, reason: string): Promise<AccessRequest> => {
    if (USE_MOCK) {
      const found = MOCK_REQUESTS.find((r) => r.id === id)
      if (!found) return Promise.reject(new Error(`Request ${id} not found`))
      const updated: AccessRequest = {
        ...found,
        status: 'declined',
        declineReason: reason,
        resolvedAt: new Date().toISOString(),
        resolvedBy: 'Admin',
        auditTrail: [
          ...found.auditTrail,
          { id: `a${found.auditTrail.length + 1}`, timestamp: new Date().toISOString(), action: 'Declined', actor: 'Admin', note: reason },
        ],
      }
      return delay(updated, 500)
    }
    return api.post<AccessRequest>(`/access/requests/${id}/decline`, { reason }).then((r) => r.data)
  },

  requestInfo: (id: string, message: string): Promise<AccessRequest> => {
    if (USE_MOCK) {
      const found = MOCK_REQUESTS.find((r) => r.id === id)
      if (!found) return Promise.reject(new Error(`Request ${id} not found`))
      const updated: AccessRequest = {
        ...found,
        status: 'info_requested',
        infoRequestedMessage: message,
        infoRequestedAt: new Date().toISOString(),
        auditTrail: [
          ...found.auditTrail,
          { id: `a${found.auditTrail.length + 1}`, timestamp: new Date().toISOString(), action: 'Info requested', actor: 'Admin', note: message },
        ],
      }
      return delay(updated, 500)
    }
    return api.post<AccessRequest>(`/access/requests/${id}/request-info`, { message }).then((r) => r.data)
  },

  bulkApprove: (ids: string[]): Promise<AccessRequest[]> => {
    if (USE_MOCK) {
      const now = new Date().toISOString()
      const updated = ids.map((id) => {
        const found = MOCK_REQUESTS.find((r) => r.id === id)
        if (!found) throw new Error(`Request ${id} not found`)
        return {
          ...found,
          status: 'approved' as const,
          resolvedAt: now,
          resolvedBy: 'Admin',
          auditTrail: [
            ...found.auditTrail,
            { id: `a${found.auditTrail.length + 1}`, timestamp: now, action: 'Approved (bulk)', actor: 'Admin' },
          ],
        }
      })
      return delay(updated, 500)
    }
    return api.post<AccessRequest[]>('/access/requests/bulk-approve', { ids }).then((r) => r.data)
  },
}
