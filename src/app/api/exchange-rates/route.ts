// src/app/api/exchange-rates/route.ts
// Endpoint to fetch current exchange rates from a public API
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  try {
    // Using exchangerate-api.com (free tier available, 1500 requests/month)
    // Alternative: Use Open Exchange Rates, Fixer.io, or other providers
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD', {
      headers: {
        'Accept': 'application/json',
      },
      // Cache the response
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch exchange rates');
    }

    const data = await response.json();

    // Return only the rates we support
    const supportedCurrencies = ['USD', 'NGN', 'EUR', 'GBP', 'CAD', 'AUD', 'ZAR', 'KES', 'GHS', 'INR'];
    const rates: Record<string, number> = {};

    supportedCurrencies.forEach(currency => {
      if (data.rates[currency]) {
        rates[currency] = data.rates[currency];
      }
    });

    return NextResponse.json({
      success: true,
      timestamp: data.time_last_updated,
      rates,
      base: 'USD'
    });
  } catch (error) {
    console.error('Exchange rate API error:', error);
    
    // Return fallback rates if API fails
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch live rates, using fallback',
      rates: {
        USD: 1,
        NGN: 1650,
        EUR: 0.92,
        GBP: 0.79,
        CAD: 1.36,
        AUD: 1.53,
        ZAR: 18.5,
        KES: 129,
        GHS: 15.8,
        INR: 83.2,
      },
      base: 'USD'
    }, { status: 200 });
  }
}
