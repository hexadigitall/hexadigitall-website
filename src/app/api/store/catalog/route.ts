import { NextResponse } from 'next/server';
import { client } from '@/sanity/client';

export async function GET(request: Request) {
  try {
    // Only textbooks for the dashboard catalog
    const query = `*[_type in ["book", "imprint", "publication"]] | order(publishedAt desc) {
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
