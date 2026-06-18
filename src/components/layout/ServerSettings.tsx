import { useState } from 'react'
import { ServerIcon } from 'lucide-react'

import {
  clearEndpointSetting,
  getEndpointSetting,
  isDemoMode,
  setEndpointSetting,
} from '@/config/endpoint'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

const LOCAL_SERVER = 'http://localhost:4000/graphql'

export function ServerSettings() {
  const demo = isDemoMode()
  const [value, setValue] = useState(() => getEndpointSetting() ?? '')

  function applyServer(endpoint: string) {
    setEndpointSetting(endpoint)
    window.location.reload()
  }

  function useDemo() {
    setEndpointSetting(null)
    window.location.reload()
  }

  function resetDefault() {
    clearEndpointSetting()
    window.location.reload()
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 rounded-full"
          aria-label="GraphQL server settings"
        >
          <ServerIcon className="size-4" />
          <Badge variant={demo ? 'secondary' : 'default'} className="px-2">
            {demo ? 'Demo' : 'Server'}
          </Badge>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="gap-6">
        <SheetHeader>
          <SheetTitle>GraphQL server</SheetTitle>
          <SheetDescription>
            By default Quereek runs the GraphQL schema in your browser, so the
            demo works with no backend. Point it at a running server to see real
            network requests and WebSocket subscriptions.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Current mode</p>
          <p className="text-sm text-muted-foreground">
            {demo ? (
              <>
                <Badge variant="secondary" className="mr-2">
                  Demo
                </Badge>
                In-browser schema (no server).
              </>
            ) : (
              <>
                <Badge className="mr-2">Server</Badge>
                Connected to{' '}
                <code className="rounded bg-muted px-1 py-0.5">
                  {getEndpointSetting()}
                </code>
              </>
            )}
          </p>
        </div>

        <div className="space-y-3">
          <label
            htmlFor="graphql-endpoint"
            className="text-sm font-medium text-foreground"
          >
            Connect to a server
          </label>
          <Input
            id="graphql-endpoint"
            placeholder={LOCAL_SERVER}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            spellCheck={false}
            autoComplete="off"
          />
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              onClick={() => applyServer(value)}
              disabled={value.trim() === ''}
            >
              Connect
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setValue(LOCAL_SERVER)
                applyServer(LOCAL_SERVER)
              }}
            >
              Use local server
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Run{' '}
            <code className="rounded bg-muted px-1 py-0.5">npm run dev</code> in
            the repo, then connect to{' '}
            <code className="rounded bg-muted px-1 py-0.5">{LOCAL_SERVER}</code>
            . Browsers allow a secure page to reach <code>localhost</code>.
          </p>
        </div>

        <div className="mt-auto flex flex-wrap gap-2 border-t border-border/60 pt-4">
          <Button size="sm" variant="secondary" onClick={useDemo}>
            Use in-browser demo
          </Button>
          <Button size="sm" variant="ghost" onClick={resetDefault}>
            Reset to default
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
