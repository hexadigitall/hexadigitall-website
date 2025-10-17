// src/app/api/revalidate/route.ts
import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Revalidation endpoint for Sanity webhooks
 * 
 * This endpoint allows Sanity CMS to trigger revalidation when content is updated,
 * ensuring the live site shows fresh content without CDN staleness.
 * 
 * Configure webhook in Sanity Dashboard:
 * - URL: https://hexadigitall.com/api/revalidate
 * - HTTP method: POST
 * - Secret: Set SANITY_REVALIDATE_SECRET in Vercel env vars
 * - Trigger on: Create, Update, Delete
 */

export async function POST(request: NextRequest) {
  try {
    // Verify the secret to prevent unauthorized revalidation
    const secret = request.nextUrl.searchParams.get('secret');
    
    if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
      return NextResponse.json(
        { message: 'Invalid secret' },
        { status: 401 }
      );
    }

    // Parse the request body to get the document type
    const body = await request.json();
    const { _type, slug } = body;

    // Log the revalidation request
    console.log('🔄 Revalidation requested:', { _type, slug });

    // Revalidate based on document type
    switch (_type) {
      case 'testimonial':
        await revalidatePath('/');
        await revalidateTag('testimonials');
        break;
      
      case 'course':
        if (slug?.current) {
          await revalidatePath(`/courses/${slug.current}`);
        }
        await revalidatePath('/courses');
        await revalidateTag('courses');
        break;
      
      case 'serviceCategory':
        if (slug?.current) {
          await revalidatePath(`/services/${slug.current}`);
        }
        await revalidatePath('/services');
        await revalidateTag('services');
        break;
      
      case 'blogPost':
        if (slug?.current) {
          await revalidatePath(`/blog/${slug.current}`);
        }
        await revalidatePath('/blog');
        await revalidateTag('blog');
        break;
      
      case 'faq':
        await revalidatePath('/faq');
        await revalidateTag('faq');
        break;
      
      default:
        // Revalidate homepage for any other content type
        await revalidatePath('/');
    }

    return NextResponse.json({
      revalidated: true,
      type: _type,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Revalidation error:', error);
    return NextResponse.json(
      { 
        message: 'Error revalidating',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Also support GET requests for manual testing
export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  const path = request.nextUrl.searchParams.get('path') || '/';
  
  if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json(
      { message: 'Invalid secret' },
      { status: 401 }
    );
  }

  try {
    await revalidatePath(path);
    return NextResponse.json({
      revalidated: true,
      path,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { 
        message: 'Error revalidating',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
