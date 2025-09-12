// Module declarations for external packages
declare module 'next-sanity' {
  export function groq(strings: TemplateStringsArray, ...values: unknown[]): string
  export * from '@sanity/client'
}

declare module '@portabletext/react' {
  import { ReactNode } from 'react'
  
  export interface PortableTextProps {
    value: Array<Record<string, unknown>>
    components?: Record<string, unknown>
  }
  
  export function PortableText(props: PortableTextProps): ReactNode
}
