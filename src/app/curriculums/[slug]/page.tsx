import { redirect } from 'next/navigation'

type Props = {
  params: Promise<{ slug: string }>
}

export default async function LegacyCurriculumRedirectPage({ params }: Props) {
  const { slug } = await params
  redirect(`/courses/${slug}/curriculum`)
}
