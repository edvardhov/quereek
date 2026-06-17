import { Link } from 'react-router-dom'

import { CodeBlock } from '@/components/inspector/CodeBlock'
import { OperationFlow } from '@/components/inspector/OperationFlow'
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
        <Tabs defaultValue="explained">
          <TabsList className="grid h-auto w-full grid-cols-5 gap-0.5">
            <TabsTrigger value="explained" className="text-xs">
              Explained
            </TabsTrigger>
            <TabsTrigger value="flow" className="text-xs">
              Flow
            </TabsTrigger>
            <TabsTrigger value="operation" className="text-xs">
              Operation
            </TabsTrigger>
            <TabsTrigger value="variables" className="text-xs">
              Variables
            </TabsTrigger>
            <TabsTrigger value="response" className="text-xs">
              Response
            </TabsTrigger>
          </TabsList>

          <TabsContent value="explained" className="space-y-3 pt-3">
            <ExplainedSection label="What happened" text={explanation.what} />
            <ExplainedSection label="How it works" text={explanation.how} />
            <div className="rounded-md border border-primary/20 bg-primary/5 p-3">
              <p className="font-mono text-[0.65rem] uppercase tracking-wider text-primary">
                Where data comes from
              </p>
              <p className="mt-1 font-mono text-xs">{explanation.dataSource}</p>
            </div>
            {explanation.fieldNotes && Object.keys(explanation.fieldNotes).length > 0 ? (
              <div className="rounded-md border bg-muted/30 p-3">
                <p className="font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">
                  Field notes
                </p>
                <dl className="mt-2 flex flex-col gap-1.5">
                  {Object.entries(explanation.fieldNotes).map(([field, note]) => (
                    <div key={field} className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
                      <dt className="shrink-0 font-mono text-xs font-medium text-foreground">
                        {field}
                      </dt>
                      <dd className="text-xs text-muted-foreground">{note}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : null}
          </TabsContent>

          <TabsContent value="flow" className="pt-3">
            <OperationFlow
              steps={explanation.flow}
              resolverPath={explanation.resolverPath}
              dataSource={explanation.dataSource}
            />
          </TabsContent>

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

function ExplainedSection({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <p className="font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-sm leading-relaxed text-foreground">{text}</p>
    </div>
  )
}
