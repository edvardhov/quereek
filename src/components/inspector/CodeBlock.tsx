import { Highlight, themes } from 'prism-react-renderer'

import { cn } from '@/lib/utils'

type CodeBlockProps = {
  code: string
  language: 'graphql' | 'json'
  className?: string
}

export function CodeBlock({ code, language, className }: CodeBlockProps) {
  const prismLanguage = language === 'graphql' ? 'graphql' : 'json'

  return (
    <Highlight theme={themes.github} code={code.trim()} language={prismLanguage}>
      {({ className: preClass, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={cn(
            'overflow-x-auto rounded-md border bg-muted/40 p-3 text-xs leading-relaxed',
            preClass,
            className,
          )}
          style={style}
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
