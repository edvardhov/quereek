import { Highlight } from 'prism-react-renderer'

import { quereekDark, quereekLight } from '@/components/inspector/codeThemes'
import { useTheme } from '@/components/theme/ThemeProvider'
import { cn } from '@/lib/utils'

type CodeBlockProps = {
  code: string
  language: 'graphql' | 'json'
  className?: string
}

export function CodeBlock({ code, language, className }: CodeBlockProps) {
  const { theme } = useTheme()
  const prismLanguage = language === 'graphql' ? 'graphql' : 'json'
  const prismTheme = theme === 'dark' ? quereekDark : quereekLight

  return (
    <Highlight theme={prismTheme} code={code.trim()} language={prismLanguage}>
      {({ className: preClass, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={cn(
            'overflow-x-auto rounded-md border border-border/60 bg-muted/40 p-3 font-mono text-xs leading-relaxed',
            preClass,
            className,
          )}
          style={{ ...style, background: undefined, backgroundColor: undefined }}
        >
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line })}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  )
}
