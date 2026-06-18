import { Link } from 'react-router-dom'
import {
  CheckCircle2Icon,
  CircleIcon,
  CircleDotIcon,
  RotateCcwIcon,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useLessons } from '@/hooks/useLessons'
import { cn } from '@/lib/utils'

export function LessonsPanel() {
  const {
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
  } = useLessons()

  if (activeLesson) {
    return (
      <div className="flex h-full min-h-0 flex-col">
        <div className="shrink-0 border-b border-border/60 p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-mono text-[0.65rem] uppercase tracking-wider text-primary">
                Active lesson
              </p>
              <h2 className="font-display text-sm font-semibold">
                {activeLesson.title}
              </h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {activeLesson.summary}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="shrink-0 text-xs"
              onClick={clearActiveLesson}
            >
              Back
            </Button>
          </div>
        </div>

        <ScrollArea className="min-h-0 flex-1 p-4">
          {isLessonComplete ? (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 px-4 py-8 text-center">
              <CheckCircle2Icon className="size-10 text-primary" />
              <p className="font-medium">Lesson complete!</p>
              <p className="text-xs text-muted-foreground">
                You completed all steps for &ldquo;{activeLesson.title}&rdquo;.
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => resetLesson(activeLesson.id)}
                >
                  <RotateCcwIcon className="size-3.5" />
                  Retry
                </Button>
                <Button size="sm" onClick={clearActiveLesson}>
                  Pick another
                </Button>
              </div>
              <Link
                to={`/concepts#${activeLesson.conceptId}`}
                className="text-xs font-medium text-primary hover:underline"
              >
                Read concept: {activeLesson.conceptId.replace(/-/g, ' ')} →
              </Link>
            </div>
          ) : currentStep ? (
            <div className="flex flex-col gap-4">
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
                <p className="font-mono text-[0.65rem] uppercase tracking-wider text-primary">
                  Step {currentStepIndex + 1} of {activeLesson.steps.length}
                </p>
                <p className="mt-2 text-sm font-medium leading-relaxed">
                  {currentStep.instruction}
                </p>
                {currentStep.hint ? (
                  <p className="mt-2 text-xs text-muted-foreground">
                    {currentStep.hint}
                  </p>
                ) : null}
                {currentStep.manual ? (
                  <Button
                    size="sm"
                    className="mt-3 w-full"
                    onClick={() =>
                      markStepComplete(activeLesson.id, currentStep.id)
                    }
                  >
                    Mark step complete
                  </Button>
                ) : currentStep.matcher ? (
                  <p className="mt-3 font-mono text-[0.65rem] text-muted-foreground">
                    Waiting for:{' '}
                    <span className="text-foreground">
                      {currentStep.matcher.operationName}
                    </span>
                  </p>
                ) : null}
              </div>

              <ol className="flex flex-col gap-2">
                {activeLesson.steps.map((step, index) => {
                  const done = completedForActive.includes(step.id)
                  const current = index === currentStepIndex
                  return (
                    <li
                      key={step.id}
                      className={cn(
                        'flex items-start gap-2 rounded-lg border px-3 py-2 text-xs',
                        done &&
                          'border-primary/20 bg-primary/5 text-muted-foreground',
                        current && !done && 'border-primary/40 bg-accent/50',
                        !done && !current && 'border-border/60 opacity-60',
                      )}
                    >
                      {done ? (
                        <CheckCircle2Icon className="mt-0.5 size-4 shrink-0 text-primary" />
                      ) : current ? (
                        <CircleDotIcon className="mt-0.5 size-4 shrink-0 text-primary" />
                      ) : (
                        <CircleIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                      )}
                      <span className={cn(done && 'line-through')}>
                        {step.instruction}
                      </span>
                    </li>
                  )
                })}
              </ol>
            </div>
          ) : null}
        </ScrollArea>
      </div>
    )
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0 border-b border-border/60 p-4">
        <h2 className="font-display text-sm font-semibold">Guided lessons</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Step-by-step challenges. Complete actions on the board and the
          inspector validates each step automatically.
        </p>
      </div>
      <ScrollArea className="min-h-0 flex-1 p-4">
        <ul className="flex flex-col gap-2">
          {lessons.map((lesson) => {
            const status = getLessonStatus(lesson)
            const doneCount = (progress.completedSteps[lesson.id] ?? []).length

            return (
              <li key={lesson.id}>
                <button
                  type="button"
                  onClick={() => startLesson(lesson.id)}
                  className={cn(
                    'w-full rounded-xl border px-4 py-3 text-left transition-colors hover:border-primary/40 hover:bg-accent/40',
                    status === 'complete' && 'border-primary/20 bg-primary/5',
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium">{lesson.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {lesson.summary}
                      </p>
                    </div>
                    {status === 'complete' ? (
                      <CheckCircle2Icon className="size-4 shrink-0 text-primary" />
                    ) : (
                      <span className="shrink-0 font-mono text-[0.65rem] text-muted-foreground">
                        {doneCount}/{lesson.steps.length}
                      </span>
                    )}
                  </div>
                </button>
              </li>
            )
          })}
        </ul>
      </ScrollArea>
    </div>
  )
}
