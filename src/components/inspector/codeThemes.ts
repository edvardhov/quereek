import type { PrismTheme } from 'prism-react-renderer'

/** Matches Quereek light mode — uses design tokens, transparent bg (Tailwind fills it). */
export const quereekLight: PrismTheme = {
  plain: {
    color: 'var(--foreground)',
    backgroundColor: 'transparent',
  },
  styles: [
    {
      types: ['comment', 'prolog', 'doctype', 'cdata'],
      style: { color: 'var(--muted-foreground)', fontStyle: 'italic' },
    },
    {
      types: ['punctuation', 'operator'],
      style: { color: 'var(--muted-foreground)' },
    },
    {
      types: [
        'property',
        'tag',
        'boolean',
        'number',
        'constant',
        'symbol',
        'deleted',
      ],
      style: { color: 'var(--status-done)' },
    },
    {
      types: [
        'selector',
        'attr-name',
        'string',
        'char',
        'builtin',
        'inserted',
        'regex',
      ],
      style: {
        color: 'color-mix(in oklch, var(--primary) 75%, var(--foreground))',
      },
    },
    {
      types: ['atrule', 'attr-value', 'keyword'],
      style: { color: 'var(--primary)' },
    },
    {
      types: ['function', 'class-name', 'important', 'variable'],
      style: { color: 'var(--foreground)' },
    },
    { types: ['entity', 'url'], style: { color: 'var(--primary)' } },
  ],
}

/** Matches Quereek dark mode — warm neutrals, orange keywords, no blue cast. */
export const quereekDark: PrismTheme = {
  plain: {
    color: 'var(--foreground)',
    backgroundColor: 'transparent',
  },
  styles: [
    {
      types: ['comment', 'prolog', 'doctype', 'cdata'],
      style: { color: 'var(--muted-foreground)', fontStyle: 'italic' },
    },
    {
      types: ['punctuation', 'operator'],
      style: { color: 'var(--muted-foreground)' },
    },
    {
      types: [
        'property',
        'tag',
        'boolean',
        'number',
        'constant',
        'symbol',
        'deleted',
      ],
      style: { color: 'var(--status-done)' },
    },
    {
      types: [
        'selector',
        'attr-name',
        'string',
        'char',
        'builtin',
        'inserted',
        'regex',
      ],
      style: {
        color: 'color-mix(in oklch, var(--primary) 70%, var(--foreground))',
      },
    },
    {
      types: ['atrule', 'attr-value', 'keyword'],
      style: { color: 'var(--primary)' },
    },
    {
      types: ['function', 'class-name', 'important', 'variable'],
      style: { color: 'var(--foreground)' },
    },
    { types: ['entity', 'url'], style: { color: 'var(--primary)' } },
  ],
}
