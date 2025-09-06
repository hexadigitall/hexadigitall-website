// src/app/api/checkout/route.ts
import { NextResponse } from 'next/server';
import { validateCartItems } from 'use-shopping-cart/utilities';
import { stripe } from '@/lib/stripe';
import { client } from '@/sanity/client';
import { groq } from 'next-sanity';

interface Course {
  _id: string;
  title: string;
  price: number;
  sku: string;
  name: string;
  currency: string;
}

export async function POST(request: Request) {
  const cartDetails = await request.json();

  // Fetch all course data from Sanity
  const rawCourses = await client.fetch(groq`*[_type == "course"]{_id, title, price}`);

  // Transform to match shopping cart Product interface
  const sanityCourses: Course[] = rawCourses.map((course: { _id: string; title: string; price: number }) => ({
    _id: course._id,
    sku: course._id, // Use _id as sku
    title: course.title,
    name: course.title, // name is required for shopping cart
    price: course.price,
    currency: 'NGN' // Nigerian Naira
  }));

  // Validate the cart against the Sanity data
  const line_items = validateCartItems(sanityCourses, cartDetails);

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items,
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cancel`,
  });

  return NextResponse.json(session);
}