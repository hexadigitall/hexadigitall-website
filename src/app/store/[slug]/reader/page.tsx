import { notFound, redirect } from 'next/navigation';
import { auth } from '@/auth';
import { client } from '@/sanity/client';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function SecureWebReaderPage({ params }: Props) {
  const { slug } = await params;
  const session = await auth();

  if (!session) {
    redirect('/student/login?callbackUrl=' + encodeURIComponent(`/store/${slug}/reader`));
  }

  const user = session.user as any;
  
  // Verify role explicitly from Sanity to ensure secure access control
  const email = user?.email;
  let isInternalTeacher = false;

  if (email) {
    const sanityUser = await client.fetch(`*[_type == "user" && email == $email][0] { role }`, { email });
    isInternalTeacher = sanityUser?.role === 'teacher' || sanityUser?.role === 'instructor' || sanityUser?.role === 'admin';
  }

  if (!isInternalTeacher) {
    redirect(`/store/${slug}`);
  }

  const query = `*[_type in ["book", "imprint"] && slug.current == $slug][0] {
    _id,
    title,
    "teacherFileUrl": teacherFile.asset->url
  }`;

  const book = await client.fetch(query, { slug });

  if (!book || !book.teacherFileUrl) {
    notFound();
  }

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-white font-sans">
      <div className="flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-slate-800 shadow-sm z-10">
        <div className="flex items-center space-x-4">
          <Link href={`/store/${slug}`} className="p-2 hover:bg-slate-800 text-slate-300 hover:text-white rounded-full transition-colors" title="Back to Store">
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="font-bold text-lg text-slate-100">{book.title}</h1>
            <p className="text-[10px] text-blue-400 font-mono tracking-widest uppercase mt-0.5">Instructor Secure Webcopy</p>
          </div>
        </div>
        <div className="text-[10px] font-black tracking-widest px-3 py-1.5 bg-amber-500/10 text-amber-500 rounded-lg border border-amber-500/20">
          COMPLIMENTARY ACCESS
        </div>
      </div>
      <div className="flex-1 w-full bg-slate-950 overflow-hidden relative">
        <iframe 
          src={`${book.teacherFileUrl}#toolbar=0&navpanes=0`} 
          className="absolute inset-0 w-full h-full border-none"
          title={`${book.title} Webcopy`}
        />
      </div>
    </div>
  );
}
