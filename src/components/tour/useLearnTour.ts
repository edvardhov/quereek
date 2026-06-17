import { useSyncExternalStore } from 'react'

import { getTourSnapshot, subscribeTour } from '@/components/tour/store'

export function useLearnTour() {
  return useSyncExternalStore(subscribeTour, getTourSnapshot, getTourSnapshot)
}
