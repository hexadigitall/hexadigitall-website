'use client'

import { use } from 'react'
import LabWorkspace from '@/components/labs/LabWorkspace'

type PageProps = { params: Promise<{ labAssignmentId: string }> }

export default function LabWorkspacePage({ params }: PageProps) {
  const { labAssignmentId } = use(params)
  return <LabWorkspace instanceId={labAssignmentId} />
}
