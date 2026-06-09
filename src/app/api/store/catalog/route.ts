import { NextResponse } from 'next/server';
import { client } from '@/sanity/client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const context = searchParams.get('context');
    
    // If context is dashboard, strictly only return textbooks (book type)
    // Otherwise return all for general store/catalog purposes
    const typeFilter = context === 'dashboard' 
        ? '["book"]' 
        : '["book", "imprint", "publication"]';

    const query = `*[_type in ${typeFilter}] | order(publishedAt desc) {
      _id,
      _type,
      title,
      subtitle,
      slug,
      "coverImage": coverImage { asset->{url} },
      status,
      authors,
      "author": author->{name, slug},
      hasTeacherVersion,
      hasStudentVersion,
      "relatedCourse": relatedCourse->{ 
        _id, 
        title, 
        slug, 
        level, 
        courseType,
        hourlyRateUSD,
        hourlyRateNGN,
        mentorshipHourlyRateUSD,
        mentorshipHourlyRateNGN,
        school->{_id, title} 
      },
      description,
      tableOfContents,
      pageCount,
      edition,
      level,
      pricing
    }`;

    const books = await client.fetch(query);

    return NextResponse.json({ success: true, books });
  } catch (error: any) {
    console.error('Catalog fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch catalog' }, { status: 500 });
  }
}
