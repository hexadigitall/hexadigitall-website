// src/app/api/checkout/route.ts
import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { client } from '@/sanity/client';
import { groq } from 'next-sanity';

interface CartItem {
  id: string;
  name: string;
  price: number;
  currency: string;
  quantity?: number;
}

interface Course {
  _id: string;
  title: string;
  price: number;
}

export async function POST(request: Request) {
  try {
    const cartDetails = await request.json();
    console.log('📦 Received cart details:', cartDetails);

    if (!cartDetails || Object.keys(cartDetails).length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Extract cart items
    const cartItems = Object.values(cartDetails) as CartItem[];
    console.log('🛍️ Cart items:', cartItems);

    // Fetch course data from Sanity to validate prices
    const courseIds = cartItems.map(item => item.id);
    const courses: Course[] = await client.fetch(
      groq`*[_type == "course" && _id in $courseIds]{_id, title, price}`,
      { courseIds }
    );
    console.log('📚 Courses from Sanity:', courses);

    // Create a lookup for validation
    const courseLookup = courses.reduce((acc: Record<string, Course>, course) => {
      acc[course._id] = course;
      return acc;
    }, {});

    // Create Stripe line items manually
    const line_items = cartItems.map((item) => {
      const course = courseLookup[item.id];
      if (!course) {
        throw new Error(`Course not found: ${item.id}`);
      }

      // Verify price matches (security check)
      if (Math.abs(course.price - item.price) > 0.01) {
        throw new Error(`Price mismatch for course ${course.title}`);
      }

      return {
        price_data: {
          currency: 'ngn',
          product_data: {
            name: course.title,
            description: `Access to ${course.title} course`,
          },
          unit_amount: Math.round(course.price * 100), // Convert to kobo (NGN smallest unit)
        },
        quantity: item.quantity || 1,
      };
    });

    console.log('💰 Stripe line items:', line_items);

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items,
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cancel`,
      metadata: {
        course_ids: courseIds.join(','),
      },
    });

    console.log('✅ Stripe session created:', session.id);
    return NextResponse.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error('💥 Checkout error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An error occurred during checkout' },
      { status: 500 }
    );
  }
}
