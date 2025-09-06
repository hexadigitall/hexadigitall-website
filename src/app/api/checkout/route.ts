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
    console.log('🛍️ Cart items count:', cartItems.length);
    cartItems.forEach((item, index) => {
      console.log(`  Item ${index + 1}:`, {
        id: item.id,
        name: item.name,
        price: item.price,
        currency: item.currency,
        quantity: item.quantity || 1
      });
    });

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
      console.log(`🔎 Price check for ${course.title}:`);
      console.log(`  - Sanity price: ${course.price}`);
      console.log(`  - Cart price: ${item.price}`);
      console.log(`  - Difference: ${Math.abs(course.price - item.price)}`);
      
      if (Math.abs(course.price - item.price) > 1) { // Allow 1 NGN difference for rounding
        throw new Error(`Price mismatch for course ${course.title}. Expected: ₦${course.price}, Got: ₦${item.price}`);
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
    
    // Log more details about the error
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred during checkout';
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: error instanceof Error ? {
          name: error.name,
          message: error.message,
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        } : null
      },
      { status: 500 }
    );
  }
}
