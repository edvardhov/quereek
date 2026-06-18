import { useCallback, useEffect, useState } from 'react'

import { lessons, matchStep, type Lesson } from '@/content/lessons'
import {
  getInspectorSnapshot,
  subscribeInspector,
  type OperationEvent,
} from '@/inspector/store'

const STORAGE_KEY = 'quereek:lessonProgress'

export type LessonProgress = {
  activeLessonId: string | null
  completedSteps: Record<string, string[]>
}

function loadProgress(): LessonProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as LessonProgress
  } catch {
    /* ignore */
  }
  return { activeLessonId: null, completedSteps: {} }
}

function saveProgress(progress: LessonProgress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
}

function getCurrentStepIndex(lesson: Lesson, completed: string[]): number {
  return lesson.steps.findIndex((step) => !completed.includes(step.id))
}

export function useLessons() {
  const [progress, setProgress] = useState<LessonProgress>(loadProgress)

  const activeLesson = progress.activeLessonId
    ? (lessons.find((l) => l.id === progress.activeLessonId) ?? null)
    : null

  const completedForActive = activeLesson
    ? (progress.completedSteps[activeLesson.id] ?? [])
    : []

  const currentStepIndex = activeLesson
    ? getCurrentStepIndex(activeLesson, completedForActive)
    : -1

  const currentStep =
    activeLesson && currentStepIndex >= 0
      ? activeLesson.steps[currentStepIndex]
      : null

  const isLessonComplete =
    activeLesson !== null &&
    currentStepIndex === -1 &&
    completedForActive.length > 0

  const startLesson = useCallback((lessonId: string) => {
    setProgress((prev) => {
      const next: LessonProgress = {
        ...prev,
        activeLessonId: lessonId,
        completedSteps: {
          ...prev.completedSteps,
          [lessonId]: prev.completedSteps[lessonId] ?? [],
        },
      }
      saveProgress(next)
      return next
    })
  }, [])

  const clearActiveLesson = useCallback(() => {
    setProgress((prev) => {
      const next: LessonProgress = { ...prev, activeLessonId: null }
      saveProgress(next)
      return next
    })
  }, [])

  const resetLesson = useCallback((lessonId: string) => {
    setProgress((prev) => {
      const next: LessonProgress = {
        ...prev,
        completedSteps: { ...prev.completedSteps, [lessonId]: [] },
        activeLessonId: lessonId,
      }
      saveProgress(next)
      return next
    })
  }, [])

  const markStepComplete = useCallback((lessonId: string, stepId: string) => {
    setProgress((prev) => {
      const existing = prev.completedSteps[lessonId] ?? []
      if (existing.includes(stepId)) return prev
      const next: LessonProgress = {
        ...prev,
        completedSteps: {
          ...prev.completedSteps,
          [lessonId]: [...existing, stepId],
        },
      }
      saveProgress(next)
      return next
    })
  }, [])

  const handleInspectorEvent = useCallback(
    (event: OperationEvent) => {
      if (event.status !== 'success') return
      if (!activeLesson || !currentStep) return
      if (currentStep.manual || !currentStep.matcher) return

      if (matchStep(currentStep.matcher, event.name, event.variables)) {
        markStepComplete(activeLesson.id, currentStep.id)
      }
    },
    [activeLesson, currentStep, markStepComplete],
  )

  useEffect(() => {
    const checkLatest = () => {
      const events = getInspectorSnapshot()
      const latest = events.find((e) => e.status === 'success')
      if (latest) handleInspectorEvent(latest)
    }

    return subscribeInspector(() => {
      const events = getInspectorSnapshot()
      const latest = events[0]
      if (latest) handleInspectorEvent(latest)
      else checkLatest()
    })
  }, [handleInspectorEvent])

  const getLessonStatus = (lesson: Lesson): 'complete' | 'active' | 'idle' => {
    const completed = progress.completedSteps[lesson.id] ?? []
    if (completed.length === lesson.steps.length && completed.length > 0)
      return 'complete'
    if (progress.activeLessonId === lesson.id) return 'active'
    return 'idle'
  }

  return {
    lessons,
    activeLesson,
    currentStep,
    currentStepIndex,
    completedForActive,
    isLessonComplete,
    progress,
    startLesson,
    clearActiveLesson,
    resetLesson,
    getLessonStatus,
    markStepComplete,
  }
}
