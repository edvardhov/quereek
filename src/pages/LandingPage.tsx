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
    <div className="flex flex-col gap-12">
      <section className="flex flex-col items-center gap-6 py-8 text-center md:py-12">
        <BrandMark iconSize={56} className="gap-3 [&_span]:text-3xl" />
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">
          Learn GraphQL by using it
        </p>
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          See every GraphQL operation as you work
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Quereek is a task manager built to teach Apollo Server, Apollo Client, and core GraphQL
          concepts. Nothing happens silently — every click shows you what was sent and why.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
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

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold">What you&apos;ll learn</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {concepts.map((concept) => (
            <Card key={concept.id}>
              <CardHeader>
                <CardTitle className="text-base">{concept.title}</CardTitle>
                <CardDescription>{concept.summary}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  to={`/concepts#${concept.id}`}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Read more →
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold">How it works</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => (
            <Card key={step.title}>
              <CardHeader>
                <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <step.icon className="size-5" />
                </div>
                <CardTitle className="text-base">
                  {index + 1}. {step.title}
                </CardTitle>
                <CardDescription>{step.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
