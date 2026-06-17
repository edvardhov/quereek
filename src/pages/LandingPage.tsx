import { ArrowRightIcon, BookOpenIcon, EyeIcon, MousePointerClickIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

import { BrandMark } from '@/components/brand/BrandMark'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { concepts } from '@/content/concepts'

const steps = [
  {
    icon: MousePointerClickIcon,
    title: 'Act',
    description: 'Use the Kanban board — create projects, add tasks, move cards, assign people.',
  },
  {
    icon: EyeIcon,
    title: 'Inspect',
    description:
      'The GraphQL Inspector shows the exact operation, variables, and JSON response for every action.',
  },
  {
    icon: BookOpenIcon,
    title: 'Understand',
    description:
      'Each event includes a plain-English explanation and a link to the concept reference.',
  },
]

export function LandingPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6">
      <section className="relative flex flex-col items-center gap-6 py-14 text-center md:py-24">
        <div className="animate-rise">
          <BrandMark iconSize={64} wordmarkClassName="text-4xl" className="gap-3" />
        </div>
        <p
          className="animate-rise font-mono text-xs font-semibold uppercase tracking-[0.28em] text-primary"
          style={{ animationDelay: '0.05s' }}
        >
          Learn GraphQL by using it
        </p>
        <h1
          className="animate-rise max-w-3xl text-balance font-brand text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl"
          style={{ animationDelay: '0.1s' }}
        >
          See <span className="text-gradient-brand">every GraphQL operation</span> as you work
        </h1>
        <p
          className="animate-rise mx-auto max-w-2xl text-pretty text-lg text-muted-foreground"
          style={{ animationDelay: '0.15s' }}
        >
          Quereek is a task manager built to teach Apollo Server, Apollo Client, and core GraphQL
          concepts. Nothing happens silently — every click shows you what was sent and why.
        </p>
        <div
          className="animate-rise flex flex-wrap justify-center gap-3"
          style={{ animationDelay: '0.2s' }}
        >
          <Button asChild size="lg" className="shadow-lg shadow-primary/25">
            <Link to="/learn">
              Start learning
              <ArrowRightIcon className="size-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/concepts">Browse concepts</Link>
          </Button>
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">What you&apos;ll learn</h2>
          <span className="font-mono text-xs text-muted-foreground">
            {concepts.length} concepts
          </span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {concepts.map((concept) => (
            <Card
              key={concept.id}
              className="group transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
            >
              <CardHeader className="p-5">
                <CardTitle className="text-base transition-colors group-hover:text-primary">
                  {concept.title}
                </CardTitle>
                <CardDescription className="leading-relaxed">{concept.summary}</CardDescription>
              </CardHeader>
              <CardContent className="p-5 pt-0">
                <Link
                  to={`/concepts#${concept.id}`}
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary"
                >
                  Read more
                  <ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-16 flex flex-col gap-6">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">How it works</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => (
            <Card key={step.title} className="relative overflow-hidden p-5">
              <span className="absolute right-4 top-3 font-display text-5xl font-bold text-muted/40">
                {index + 1}
              </span>
              <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-primary/12 text-primary">
                <step.icon className="size-5" />
              </div>
              <CardTitle className="text-base">{step.title}</CardTitle>
              <CardDescription className="mt-1 leading-relaxed">
                {step.description}
              </CardDescription>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
