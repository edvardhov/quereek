import { Link } from 'react-router-dom'

import { CodeBlock } from '@/components/inspector/CodeBlock'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getExplanation } from '@/inspector/explanations'
import type { OperationEvent } from '@/inspector/store'

type InspectorEventProps = {
  event: OperationEvent
}

const typeVariant: Record<
  OperationEvent['type'],
  'default' | 'secondary' | 'outline'
> = {
  query: 'secondary',
  mutation: 'default',
  subscription: 'outline',
}

export function InspectorEvent({ event }: InspectorEventProps) {
  const explanation = getExplanation(event.name)
  const statusLabel =
    event.status === 'pending'
      ? 'In flight…'
      : event.status === 'error'
        ? 'Error'
        : `${event.durationMs ?? 0}ms`

  return (
    <Card className="overflow-hidden">
      <CardHeader className="gap-2 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={typeVariant[event.type]}>{event.type}</Badge>
          <CardTitle className="text-sm font-semibold">{event.name}</CardTitle>
          <Badge variant="outline" className="ml-auto">
            {statusLabel}
          </Badge>
        </div>
        <div className="rounded-md border bg-accent/40 p-3 text-sm">
          <p className="font-medium">{explanation.title}</p>
          <p className="mt-1 text-muted-foreground">{explanation.summary}</p>
          <Link
            to={`/concepts#${explanation.conceptId}`}
            className="mt-2 inline-block text-xs font-medium text-primary hover:underline"
          >
            Learn: {explanation.conceptId.replace(/-/g, ' ')} →
          </Link>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <Tabs defaultValue="operation">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="operation">Operation</TabsTrigger>
            <TabsTrigger value="variables">Variables</TabsTrigger>
            <TabsTrigger value="response">Response</TabsTrigger>
          </TabsList>
          <TabsContent value="operation">
            <CodeBlock code={event.document} language="graphql" />
          </TabsContent>
          <TabsContent value="variables">
            <CodeBlock
              code={JSON.stringify(event.variables, null, 2)}
              language="json"
            />
          </TabsContent>
          <TabsContent value="response">
            {event.errors?.length ? (
              <CodeBlock
                code={JSON.stringify(event.errors, null, 2)}
                language="json"
              />
            ) : event.response ? (
              <CodeBlock
                code={JSON.stringify(event.response, null, 2)}
                language="json"
              />
            ) : (
              <p className="text-sm text-muted-foreground">Waiting for response…</p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
