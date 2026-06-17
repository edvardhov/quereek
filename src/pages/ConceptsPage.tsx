import { concepts } from '@/content/concepts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export function ConceptsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">GraphQL concepts</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Reference for every concept Quereek demonstrates. Links from the inspector point here.
        </p>
      </div>
      <Separator />
      <div className="flex flex-col gap-8">
        {concepts.map((concept) => (
          <section key={concept.id} id={concept.id} className="scroll-mt-20">
            <Card>
              <CardHeader>
                <CardTitle>{concept.title}</CardTitle>
                <CardDescription>{concept.summary}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <p className="text-sm leading-relaxed">{concept.description}</p>
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Where it&apos;s used in Quereek
                  </p>
                  <ul className="list-inside list-disc text-sm text-muted-foreground">
                    {concept.whereUsed.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </section>
        ))}
      </div>
    </div>
  )
}
