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
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8 sm:px-6 sm:py-12">
      <div>
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          Reference
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">GraphQL concepts</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Reference for every concept Quereek demonstrates. Links from the inspector point here.
        </p>
      </div>
      <Separator />
      <div className="flex flex-col gap-6">
        {concepts.map((concept) => (
          <section key={concept.id} id={concept.id} className="scroll-mt-24">
            <Card className="transition-colors hover:border-primary/40">
              <CardHeader className="p-6">
                <CardTitle className="text-xl">{concept.title}</CardTitle>
                <CardDescription className="text-base">{concept.summary}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 p-6 pt-0">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {concept.description}
                </p>
                <div className="rounded-xl border border-border/70 bg-muted/30 p-4">
                  <p className="mb-2 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-primary">
                    Where it&apos;s used in Quereek
                  </p>
                  <ul className="flex flex-col gap-1 text-sm text-muted-foreground">
                    {concept.whereUsed.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary/60" />
                        {item}
                      </li>
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
