import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { XIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import {
  endTour,
  hasSeenTour,
  markTourSeen,
  setTourStep,
  startTour,
} from '@/components/tour/store'
import { useLearnTour } from '@/components/tour/useLearnTour'
import { TOUR_STEPS, type TourPlacement, type TourStep } from '@/components/tour/tourSteps'

const SPOTLIGHT_PADDING = 8
const TOOLTIP_GAP = 12
const TOOLTIP_MAX_WIDTH = 360
const AUTO_START_DELAY_MS = 600

type Rect = { top: number; left: number; width: number; height: number }

function getTargetElement(target?: string): Element | null {
  if (!target) return null
  return document.querySelector(`[data-tour="${target}"]`)
}

function isStepTargetVisible(step: TourStep): boolean {
  if (!step.target) return true
  const el = getTargetElement(step.target)
  if (!el) return false
  const rect = el.getBoundingClientRect()
  return rect.width > 0 && rect.height > 0
}

function findVisibleStepIndex(from: number, direction: 1 | -1): number | null {
  let index = from + direction
  while (index >= 0 && index < TOUR_STEPS.length) {
    if (isStepTargetVisible(TOUR_STEPS[index])) return index
    index += direction
  }
  return null
}

function getSpotlightRect(el: Element): Rect {
  const rect = el.getBoundingClientRect()
  return {
    top: rect.top - SPOTLIGHT_PADDING,
    left: rect.left - SPOTLIGHT_PADDING,
    width: rect.width + SPOTLIGHT_PADDING * 2,
    height: rect.height + SPOTLIGHT_PADDING * 2,
  }
}

function computeTooltipPosition(
  spotlight: Rect,
  placement: TourPlacement,
  tooltipWidth: number,
  tooltipHeight: number,
): { top: number; left: number } {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const margin = 16

  if (placement === 'center') {
    return {
      top: Math.max(margin, Math.min(vh / 2 - tooltipHeight / 2, vh - tooltipHeight - margin)),
      left: Math.max(margin, Math.min(vw / 2 - tooltipWidth / 2, vw - tooltipWidth - margin)),
    }
  }

  let top = 0
  let left = 0

  switch (placement) {
    case 'top':
      top = spotlight.top - TOOLTIP_GAP - tooltipHeight
      left = spotlight.left + spotlight.width / 2 - tooltipWidth / 2
      break
    case 'bottom':
      top = spotlight.top + spotlight.height + TOOLTIP_GAP
      left = spotlight.left + spotlight.width / 2 - tooltipWidth / 2
      break
    case 'left':
      top = spotlight.top + spotlight.height / 2 - tooltipHeight / 2
      left = spotlight.left - TOOLTIP_GAP - tooltipWidth
      break
    case 'right':
      top = spotlight.top + spotlight.height / 2 - tooltipHeight / 2
      left = spotlight.left + spotlight.width + TOOLTIP_GAP
      break
  }

  return {
    top: Math.max(margin, Math.min(top, vh - tooltipHeight - margin)),
    left: Math.max(margin, Math.min(left, vw - tooltipWidth - margin)),
  }
}

export function LearnTour() {
  const { active, stepIndex } = useLearnTour()
  const step = TOUR_STEPS[stepIndex]
  const tooltipRef = useRef<HTMLDivElement>(null)
  const [spotlight, setSpotlight] = useState<Rect | null>(null)
  const [tooltipPos, setTooltipPos] = useState<{ top: number; left: number } | null>(null)
  const rafRef = useRef<number | null>(null)

  const finish = useCallback(() => {
    markTourSeen()
    endTour()
    setSpotlight(null)
    setTooltipPos(null)
  }, [])

  const goNext = useCallback(() => {
    const next = findVisibleStepIndex(stepIndex, 1)
    if (next !== null) {
      setTourStep(next)
    } else {
      finish()
    }
  }, [stepIndex, finish])

  const goBack = useCallback(() => {
    const prev = findVisibleStepIndex(stepIndex, -1)
    if (prev !== null) {
      setTourStep(prev)
    }
  }, [stepIndex])

  const updatePositions = useCallback(() => {
    if (!active || !step) return

    if (step.placement === 'center' || !step.target) {
      setSpotlight(null)
      const el = tooltipRef.current
      if (el) {
        const { width, height } = el.getBoundingClientRect()
        setTooltipPos(computeTooltipPosition(
          { top: 0, left: 0, width: 0, height: 0 },
          'center',
          width || TOOLTIP_MAX_WIDTH,
          height || 200,
        ))
      }
      return
    }

    const target = getTargetElement(step.target)
    if (!target) {
      const next = findVisibleStepIndex(stepIndex, 1)
      if (next !== null) setTourStep(next)
      else finish()
      return
    }

    const rect = getSpotlightRect(target)
    setSpotlight(rect)

    const el = tooltipRef.current
    if (el) {
      const { width, height } = el.getBoundingClientRect()
      setTooltipPos(computeTooltipPosition(rect, step.placement, width || TOOLTIP_MAX_WIDTH, height || 160))
    }
  }, [active, step, stepIndex, finish])

  useEffect(() => {
    if (!active) return
    const el = step?.target ? getTargetElement(step.target) : null
    el?.scrollIntoView({ block: 'center', behavior: 'smooth' })

    const frame = requestAnimationFrame(updatePositions)
    const timer = window.setTimeout(updatePositions, 300)
    return () => {
      cancelAnimationFrame(frame)
      window.clearTimeout(timer)
    }
  }, [active, stepIndex, step, updatePositions])

  useEffect(() => {
    if (!active) return

    const scheduleUpdate = () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null
        updatePositions()
      })
    }

    window.addEventListener('resize', scheduleUpdate)
    window.addEventListener('scroll', scheduleUpdate, true)
    return () => {
      window.removeEventListener('resize', scheduleUpdate)
      window.removeEventListener('scroll', scheduleUpdate, true)
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [active, updatePositions])

  useEffect(() => {
    if (!active) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        finish()
      } else if (event.key === 'ArrowRight' || event.key === 'Enter') {
        event.preventDefault()
        goNext()
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault()
        goBack()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [active, finish, goNext, goBack])

  useEffect(() => {
    if (hasSeenTour()) return
    const timer = window.setTimeout(() => startTour(), AUTO_START_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!active) return
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [active])

  if (!active || !step) return null

  const isFirst = findVisibleStepIndex(stepIndex, -1) === null
  const isLast = findVisibleStepIndex(stepIndex, 1) === null
  const visibleStepNumber =
    TOUR_STEPS.slice(0, stepIndex + 1).filter(isStepTargetVisible).length
  const visibleStepTotal = TOUR_STEPS.filter(isStepTargetVisible).length
  const isCenter = step.placement === 'center' || !step.target

  return createPortal(
    <div className="fixed inset-0 z-[200]" role="dialog" aria-modal="true" aria-label="Learn page tour">
      {isCenter ? (
        <button
          type="button"
          className="absolute inset-0 bg-black/60"
          aria-label="Next step"
          onClick={goNext}
        />
      ) : (
        <>
          <button
            type="button"
            className="absolute inset-0"
            aria-label="Next step"
            onClick={goNext}
          />
          {spotlight ? (
            <div
              className="pointer-events-none fixed rounded-xl ring-2 ring-primary/80 ring-offset-2 ring-offset-transparent transition-all duration-200"
              style={{
                top: spotlight.top,
                left: spotlight.left,
                width: spotlight.width,
                height: spotlight.height,
                boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.6)',
              }}
            />
          ) : null}
        </>
      )}

      <div
        ref={tooltipRef}
        className={cn(
          'pointer-events-auto fixed z-[201] w-[min(100vw-2rem,22.5rem)]',
          isCenter && 'border-primary/30',
        )}
        style={
          tooltipPos
            ? { top: tooltipPos.top, left: tooltipPos.left }
            : { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }
        }
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="shadow-xl">
        <CardHeader className="relative gap-2 p-5 pb-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-3 top-3 size-8 text-muted-foreground"
            aria-label="Skip tour"
            onClick={finish}
          >
            <XIcon className="size-4" />
          </Button>
          <p className="font-mono text-[0.65rem] font-medium uppercase tracking-[0.18em] text-primary">
            Step {visibleStepNumber} of {visibleStepTotal}
          </p>
          <CardTitle className="pr-8 text-lg">{step.title}</CardTitle>
        </CardHeader>
        <CardContent className="px-5 pb-4">
          <p className="text-sm leading-relaxed text-muted-foreground">{step.body}</p>
        </CardContent>
        <CardFooter className="flex items-center justify-between gap-2 px-5 pb-5 pt-0">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={isFirst}
            onClick={goBack}
          >
            Back
          </Button>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={finish}>
              Skip
            </Button>
            <Button type="button" size="sm" onClick={isLast ? finish : goNext}>
              {isLast ? 'Finish' : 'Next'}
            </Button>
          </div>
        </CardFooter>
        </Card>
      </div>
    </div>,
    document.body,
  )
}
