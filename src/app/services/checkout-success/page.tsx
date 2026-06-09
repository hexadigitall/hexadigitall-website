import { Suspense } from 'react'
import CheckoutSuccessClient from './CheckoutSuccessClient'

export const dynamic = 'force-static'

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <CheckoutSuccessClient />
    </Suspense>
  )
}
