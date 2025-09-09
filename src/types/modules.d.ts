// Module declarations for external packages
declare module 'next-sanity' {
  export function groq(strings: TemplateStringsArray, ...values: any[]): string
  export * from '@sanity/client'
}

declare module '@portabletext/react' {
  import { ReactNode } from 'react'
  
  export interface PortableTextProps {
    value: any[]
    components?: any
  }
  
  export function PortableText(props: PortableTextProps): ReactNode
}
