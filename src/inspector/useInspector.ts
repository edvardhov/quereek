import { useSyncExternalStore } from 'react'

import {
  clearInspector,
  getInspectorSnapshot,
  subscribeInspector,
} from '@/inspector/store'

export function useInspector() {
  const events = useSyncExternalStore(
    subscribeInspector,
    getInspectorSnapshot,
    getInspectorSnapshot,
  )

  return { events, clear: clearInspector }
}
