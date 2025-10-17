// src/app/api/subscriptions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { 
  CreateSubscriptionRequest, 
  CourseSubscription, 
  SubscriptionStatus 
} from '@/types/subscription';
import Stripe from 'stripe';

// Force dynamic rendering to avoid build-time initialization
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * POST /api/subscriptions
 * Create a new subscription for a live course
 */
export async function POST(request: NextRequest) {
  try {
    const stripe = getStripe();
    const body: CreateSubscriptionRequest = await request.json();
    
    console.log('🔄 [SUBSCRIPTION] Creating subscription for course:', body.courseId);
    
    // Validate required fields
    if (!body.courseId || !body.studentDetails || !body.plan) {
      return NextResponse.json(
        { error: 'Missing required fields: courseId, studentDetails, or plan' },
        { status: 400 }
      );
    }

    const { courseId, studentDetails, plan, paymentMethodId, trialPeriodDays, couponCode, preferredSchedule } = body;

    // 1. Create or retrieve Stripe customer
    let customer: Stripe.Customer;
    
    // Check if customer already exists by email
    const existingCustomers = await stripe.customers.list({
      email: studentDetails.email,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
      console.log('✅ [SUBSCRIPTION] Found existing customer:', customer.id);
    } else {
      customer = await stripe.customers.create({
        name: studentDetails.fullName,
        email: studentDetails.email,
        phone: studentDetails.phone,
        metadata: {
          courseId,
          experience: studentDetails.experience || '',
          goals: studentDetails.goals || '',
          source: 'hexadigitall-live-course',
          createdAt: new Date().toISOString(),
        },
      });
      console.log('✅ [SUBSCRIPTION] Created new customer:', customer.id);
    }

    // 2. Attach payment method if provided
    if (paymentMethodId) {
      try {
        await stripe.paymentMethods.attach(paymentMethodId, {
          customer: customer.id,
        });
        
        // Set as default payment method
        await stripe.customers.update(customer.id, {
          invoice_settings: {
            default_payment_method: paymentMethodId,
          },
        });
        console.log('✅ [SUBSCRIPTION] Payment method attached and set as default');
      } catch (error) {
        console.error('❌ [SUBSCRIPTION] Failed to attach payment method:', error);
        return NextResponse.json(
          { error: 'Failed to attach payment method' },
          { status: 400 }
        );
      }
    }

    // 3. Create or retrieve Stripe product for this course
    const productId = `course_${courseId}`;
    let product: Stripe.Product;
    
    try {
      product = await stripe.products.retrieve(productId);
    } catch {
      // Product doesn't exist, create it
      product = await stripe.products.create({
        id: productId,
        name: plan.courseName,
        description: `Live mentoring sessions for ${plan.courseName}`,
        metadata: {
          courseId,
          sessionFormat: plan.sessionCustomization.sessionFormat,
          sessionsPerWeek: plan.sessionCustomization.sessionsPerWeek.toString(),
          hoursPerSession: plan.sessionCustomization.hoursPerSession.toString(),
          type: 'live-course-subscription',
        },
      });
      console.log('✅ [SUBSCRIPTION] Created new product:', product.id);
    }

    // 4. Create price for the subscription
    const priceId = `price_${courseId}_${plan.sessionCustomization.sessionFormat}_${plan.sessionCustomization.sessionsPerWeek}x${plan.sessionCustomization.hoursPerSession}`;
    let price: Stripe.Price;
    
    try {
      price = await stripe.prices.retrieve(priceId);
    } catch {
      // Price doesn't exist, create it
      price = await stripe.prices.create({
        product: product.id,
        currency: plan.currency.toLowerCase(),
        recurring: {
          interval: plan.interval,
        },
        unit_amount: Math.round(plan.billingCalculation.monthlyTotal * 100), // Convert to cents
        metadata: {
          courseId,
          sessionsPerWeek: plan.sessionCustomization.sessionsPerWeek.toString(),
          hoursPerSession: plan.sessionCustomization.hoursPerSession.toString(),
          sessionFormat: plan.sessionCustomization.sessionFormat,
          baseHourlyRate: plan.billingCalculation.baseHourlyRate.toString(),
          adjustedHourlyRate: plan.billingCalculation.adjustedHourlyRate.toString(),
          hoursPerMonth: plan.billingCalculation.hoursPerMonth.toString(),
        },
      });
      console.log('✅ [SUBSCRIPTION] Created new price:', price.id);
    }

    // 5. Create the subscription
    const subscriptionData: Stripe.SubscriptionCreateParams = {
      customer: customer.id,
      items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      payment_behavior: 'default_incomplete',
      payment_settings: {
        save_default_payment_method: 'on_subscription',
      },
      expand: ['latest_invoice.payment_intent', 'customer'],
      metadata: {
        courseId,
        planId: plan.id,
        studentId: customer.id, // For now, use customer ID as student ID
        sessionsPerWeek: plan.sessionCustomization.sessionsPerWeek.toString(),
        hoursPerSession: plan.sessionCustomization.hoursPerSession.toString(),
        sessionFormat: plan.sessionCustomization.sessionFormat,
        preferredDays: preferredSchedule?.daysOfWeek.join(',') || '',
        preferredTimes: preferredSchedule?.preferredTimes.join(',') || '',
        timeZone: preferredSchedule?.timeZone || '',
        source: 'hexadigitall-api',
        createdAt: new Date().toISOString(),
      },
    };

    // Add trial period if specified
    if (trialPeriodDays && trialPeriodDays > 0) {
      subscriptionData.trial_period_days = trialPeriodDays;
    }

    // Add coupon if specified
    if (couponCode) {
      subscriptionData.discounts = [
        {
          coupon: couponCode,
        },
      ];
    }

    const subscription = await stripe.subscriptions.create(subscriptionData);
    console.log('✅ [SUBSCRIPTION] Created Stripe subscription:', subscription.id);

    // 6. Transform Stripe subscription to our CourseSubscription interface
    const courseSubscription: CourseSubscription = {
      id: subscription.id,
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: customer.id,
      courseId,
      studentId: customer.id, // Using customer ID as student ID for now
      
      plan,
      
      status: subscription.status as SubscriptionStatus,
      currentPeriodStart: new Date((subscription as unknown as Record<string, unknown>).current_period_start as number * 1000).toISOString(),
      currentPeriodEnd: new Date((subscription as unknown as Record<string, unknown>).current_period_end as number * 1000).toISOString(),
      cancelAtPeriodEnd: (subscription as unknown as Record<string, unknown>).cancel_at_period_end as boolean,
      canceledAt: (subscription as unknown as Record<string, unknown>).canceled_at ? new Date((subscription as unknown as Record<string, unknown>).canceled_at as number * 1000).toISOString() : undefined,
      trialStart: (subscription as unknown as Record<string, unknown>).trial_start ? new Date((subscription as unknown as Record<string, unknown>).trial_start as number * 1000).toISOString() : undefined,
      trialEnd: (subscription as unknown as Record<string, unknown>).trial_end ? new Date((subscription as unknown as Record<string, unknown>).trial_end as number * 1000).toISOString() : undefined,
      
      priceAmount: Math.round(plan.billingCalculation.monthlyTotal * 100),
      currency: plan.currency,
      
      createdAt: new Date((subscription as unknown as Record<string, unknown>).created as number * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      
      sessionHistory: [],
      // nextSessionScheduled will be set by scheduling system
    };

    // 7. Determine response based on subscription status
    if (subscription.status === 'incomplete') {
      // Subscription requires payment method setup
      const latest_invoice = subscription.latest_invoice as Stripe.Invoice;
      const payment_intent = (latest_invoice as unknown as Record<string, unknown>)?.payment_intent as Stripe.PaymentIntent;
      
      return NextResponse.json({
        success: false,
        requiresAction: true,
        subscription: courseSubscription,
        clientSecret: payment_intent?.client_secret,
        paymentIntentId: payment_intent?.id,
        message: 'Payment method setup required',
      });
    }

    if (subscription.status === 'trialing' || subscription.status === 'active') {
      // Subscription is ready to go
      return NextResponse.json({
        success: true,
        subscription: courseSubscription,
        message: `Subscription created successfully. ${subscription.status === 'trialing' ? 'Trial period active.' : 'Billing will begin immediately.'}`,
      });
    }

    // Handle other statuses
    return NextResponse.json({
      success: false,
      subscription: courseSubscription,
      message: `Subscription created with status: ${subscription.status}`,
    });

  } catch (error) {
    console.error('❌ [SUBSCRIPTION] Error creating subscription:', error);
    
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: `Stripe error: ${error.message}` },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/subscriptions?customer_id=xxx
 * Retrieve subscriptions for a customer
 */
export async function GET(request: NextRequest) {
  try {
    const stripe = getStripe();
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customer_id');
    const subscriptionId = searchParams.get('subscription_id');

    if (subscriptionId) {
      // Get specific subscription
      const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
        expand: ['customer', 'latest_invoice', 'default_payment_method'],
      });

      // Transform to our interface (simplified version)
      const courseSubscription: Partial<CourseSubscription> = {
        id: subscription.id,
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        status: subscription.status as SubscriptionStatus,
        currentPeriodStart: new Date((subscription as unknown as Record<string, unknown>).current_period_start as number * 1000).toISOString(),
        currentPeriodEnd: new Date((subscription as unknown as Record<string, unknown>).current_period_end as number * 1000).toISOString(),
        cancelAtPeriodEnd: (subscription as unknown as Record<string, unknown>).cancel_at_period_end as boolean,
        createdAt: new Date((subscription as unknown as Record<string, unknown>).created as number * 1000).toISOString(),
      };

      return NextResponse.json({ subscription: courseSubscription });
    }

    if (customerId) {
      // Get all subscriptions for customer
      const subscriptions = await stripe.subscriptions.list({
        customer: customerId,
        expand: ['data.latest_invoice'],
      });

      return NextResponse.json({ 
        subscriptions: subscriptions.data.map(sub => ({
          id: sub.id,
          status: sub.status,
          currentPeriodStart: new Date((sub as unknown as Record<string, unknown>).current_period_start as number * 1000).toISOString(),
          currentPeriodEnd: new Date((sub as unknown as Record<string, unknown>).current_period_end as number * 1000).toISOString(),
          cancelAtPeriodEnd: (sub as unknown as Record<string, unknown>).cancel_at_period_end as boolean,
        }))
      });
    }

    return NextResponse.json(
      { error: 'Either customer_id or subscription_id is required' },
      { status: 400 }
    );

  } catch (error) {
    console.error('❌ [SUBSCRIPTION] Error retrieving subscriptions:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve subscriptions' },
      { status: 500 }
    );
  }
}