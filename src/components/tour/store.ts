export const TOUR_SEEN_KEY = 'quereek:learnTourSeen'

type TourState = {
  active: boolean
  stepIndex: number
}

let state: TourState = {
  active: false,
  stepIndex: 0,
}

const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((listener) => listener())
}

export function subscribeTour(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getTourSnapshot(): TourState {
  return state
}

export function startTour() {
  state = { active: true, stepIndex: 0 }
  emit()
}

export function setTourStep(stepIndex: number) {
  state = { ...state, stepIndex }
  emit()
}

export function endTour() {
  state = { active: false, stepIndex: 0 }
  emit()
}

export function markTourSeen() {
  localStorage.setItem(TOUR_SEEN_KEY, '1')
}

export function hasSeenTour(): boolean {
  return localStorage.getItem(TOUR_SEEN_KEY) === '1'
}
