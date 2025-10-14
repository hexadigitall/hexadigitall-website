// src/app/api/subscriptions/customer-portal/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { CustomerPortalConfig } from '@/types/subscription';
import Stripe from 'stripe';

/**
 * POST /api/subscriptions/customer-portal
 * Create a Stripe Customer Portal session for subscription management
 */
export async function POST(request: NextRequest) {
  try {
    const stripe = getStripe();
    const body: CustomerPortalConfig = await request.json();

    console.log('🔄 [CUSTOMER PORTAL] Creating portal session for subscription:', body.subscriptionId);

    // Validate required fields
    if (!body.returnUrl) {
      return NextResponse.json(
        { error: 'returnUrl is required' },
        { status: 400 }
      );
    }

    let customerId: string;

    // If subscriptionId provided, get customer from subscription
    if (body.subscriptionId) {
      const subscription = await stripe.subscriptions.retrieve(body.subscriptionId);
      customerId = subscription.customer as string;
    } else {
      return NextResponse.json(
        { error: 'subscriptionId is required to identify the customer' },
        { status: 400 }
      );
    }

    // Create portal session configuration
    const portalSessionConfig: Stripe.BillingPortal.SessionCreateParams = {
      customer: customerId,
      return_url: body.returnUrl,
    };

    // Add flow data for specific actions
    if (body.flowData) {
      const flowData: Stripe.BillingPortal.SessionCreateParams.FlowData = {
        type: body.flowData.type as 'subscription_cancel' | 'subscription_update' | 'subscription_update_confirm' | 'payment_method_update',
        after_completion: {
          type: 'redirect',
          redirect: {
            return_url: body.returnUrl
          }
        }
      };

      // Subscription-specific flow configurations
      if (body.flowData.type === 'subscription_cancel' && body.subscriptionId) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (flowData as any).subscription_cancel = {
          subscription: body.subscriptionId,
        };
      } else if (body.flowData.type === 'subscription_update_confirm' && body.subscriptionId) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (flowData as any).subscription_update_confirm = {
          subscription: body.subscriptionId,
        };
      }

      portalSessionConfig.flow_data = flowData;
    }

    // Create the portal session
    const portalSession = await stripe.billingPortal.sessions.create(portalSessionConfig);

    console.log('✅ [CUSTOMER PORTAL] Portal session created:', portalSession.id);

    return NextResponse.json({
      success: true,
      portalUrl: portalSession.url,
      sessionId: portalSession.id,
      message: 'Customer portal session created successfully',
    });

  } catch (error) {
    console.error('❌ [CUSTOMER PORTAL] Error creating portal session:', error);
    
    if (error instanceof Error && error.message.includes('billing portal configuration')) {
      return NextResponse.json(
        { 
          error: 'Billing portal is not configured. Please set up your Stripe Customer Portal in the dashboard.',
          setupUrl: 'https://dashboard.stripe.com/settings/billing/portal'
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create customer portal session' },
      { status: 500 }
    );
  }
}