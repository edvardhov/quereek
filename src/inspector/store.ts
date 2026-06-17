export type OperationType = 'query' | 'mutation' | 'subscription'
export type OperationStatus = 'pending' | 'success' | 'error'

export type OperationEvent = {
  id: string
  type: OperationType
  name: string
  document: string
  variables: Record<string, unknown>
  status: OperationStatus
  response?: unknown
  errors?: Array<{ message: string }>
  durationMs?: number
  startedAt: number
}

const MAX_EVENTS = 50
let events: OperationEvent[] = []
const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((listener) => listener())
}

export function subscribeInspector(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function getInspectorSnapshot(): OperationEvent[] {
  return events
}

export function recordOperation(
  event: Omit<OperationEvent, 'status'> & { status?: OperationStatus },
): string {
  const full: OperationEvent = {
    status: 'pending',
    ...event,
  }
  events = [full, ...events].slice(0, MAX_EVENTS)
  emit()
  return full.id
}

export function updateOperation(
  id: string,
  patch: Partial<Omit<OperationEvent, 'id'>>,
) {
  events = events.map((event) =>
    event.id === id ? { ...event, ...patch } : event,
  )
  emit()
}

export function clearInspector() {
  events = []
  emit()
}
