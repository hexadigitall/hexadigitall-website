// src/app/api/subscriptions/[subscriptionId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { UpdateSubscriptionRequest, CourseSubscription, SubscriptionStatus } from '@/types/subscription';
import Stripe from 'stripe';

interface RouteParams {
  params: Promise<{
    subscriptionId: string;
  }>;
}

/**
 * GET /api/subscriptions/[subscriptionId]
 * Retrieve specific subscription details
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const stripe = getStripe();
    const { subscriptionId } = await params;

    console.log('🔄 [SUBSCRIPTION] Retrieving subscription:', subscriptionId);

    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: [
        'customer', 
        'latest_invoice', 
        'default_payment_method',
        'items.data.price.product'
      ],
    });

    // Extract metadata for plan reconstruction
    const metadata = subscription.metadata;
    const customer = subscription.customer as Stripe.Customer;
    const defaultPaymentMethod = subscription.default_payment_method as Stripe.PaymentMethod;

    // Reconstruct our CourseSubscription interface
    const courseSubscription: CourseSubscription = {
      id: subscription.id,
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: customer.id,
      courseId: metadata.courseId || '',
      studentId: metadata.studentId || customer.id,
      
      // Reconstruct plan from metadata
      plan: {
        id: metadata.planId || `plan_${subscription.id}`,
        courseId: metadata.courseId || '',
        courseName: (typeof subscription.items.data[0]?.price.product === 'object' && subscription.items.data[0]?.price.product !== null && 'name' in subscription.items.data[0].price.product) 
          ? (subscription.items.data[0].price.product as Stripe.Product).name || 'Unknown Course'
          : 'Unknown Course',
        billingCalculation: {
          baseHourlyRate: parseFloat(metadata.baseHourlyRate || '0'),
          adjustedHourlyRate: parseFloat(metadata.adjustedHourlyRate || '0'),
          sessionFormatMultiplier: parseFloat(metadata.sessionFormatMultiplier || '1'),
          hoursPerWeek: parseInt(metadata.sessionsPerWeek || '0') * parseInt(metadata.hoursPerSession || '0'),
          hoursPerMonth: parseFloat(metadata.hoursPerMonth || '0'),
          monthlyTotal: (subscription.items.data[0]?.price.unit_amount || 0) / 100,
          currency: subscription.currency.toUpperCase(),
          breakdown: {
            sessions: `${metadata.sessionsPerWeek} session${parseInt(metadata.sessionsPerWeek || '0') !== 1 ? 's' : ''} per week`,
            duration: `${metadata.hoursPerSession} hour${parseInt(metadata.hoursPerSession || '0') !== 1 ? 's' : ''} per session`,
            weekly: `${parseInt(metadata.sessionsPerWeek || '0') * parseInt(metadata.hoursPerSession || '0')} hours per week`,
            monthly: `${metadata.hoursPerMonth} hours per month`,
            rate: `${metadata.adjustedHourlyRate}/hour (${metadata.sessionFormat?.replace('-', ' ') || 'unknown'})`
          }
        },
        sessionCustomization: {
          sessionsPerWeek: parseInt(metadata.sessionsPerWeek || '1'),
          hoursPerSession: parseInt(metadata.hoursPerSession || '1'),
          totalHoursPerWeek: parseInt(metadata.sessionsPerWeek || '0') * parseInt(metadata.hoursPerSession || '0'),
          sessionFormat: (metadata.sessionFormat as 'one-on-one' | 'small-group' | 'large-group') || 'one-on-one',
          preferredDays: metadata.preferredDays?.split(',').filter(Boolean),
          preferredTimeSlots: metadata.preferredTimes?.split(',').filter(Boolean)
        },
        currency: subscription.currency.toUpperCase(),
        interval: 'month',
      },
      
      status: subscription.status as SubscriptionStatus,
      currentPeriodStart: new Date((subscription as unknown as Record<string, unknown>).current_period_start as number * 1000).toISOString(),
      currentPeriodEnd: new Date((subscription as unknown as Record<string, unknown>).current_period_end as number * 1000).toISOString(),
      cancelAtPeriodEnd: (subscription as unknown as Record<string, unknown>).cancel_at_period_end as boolean,
      canceledAt: (subscription as unknown as Record<string, unknown>).canceled_at ? new Date((subscription as unknown as Record<string, unknown>).canceled_at as number * 1000).toISOString() : undefined,
      trialStart: (subscription as unknown as Record<string, unknown>).trial_start ? new Date((subscription as unknown as Record<string, unknown>).trial_start as number * 1000).toISOString() : undefined,
      trialEnd: (subscription as unknown as Record<string, unknown>).trial_end ? new Date((subscription as unknown as Record<string, unknown>).trial_end as number * 1000).toISOString() : undefined,
      
      priceAmount: subscription.items.data[0]?.price.unit_amount || 0,
      currency: subscription.currency.toUpperCase(),
      
      defaultPaymentMethod: defaultPaymentMethod ? {
        id: defaultPaymentMethod.id,
        type: defaultPaymentMethod.type,
        card: defaultPaymentMethod.card ? {
          brand: defaultPaymentMethod.card.brand,
          last4: defaultPaymentMethod.card.last4,
          exp_month: defaultPaymentMethod.card.exp_month,
          exp_year: defaultPaymentMethod.card.exp_year,
        } : undefined,
        billing_details: defaultPaymentMethod.billing_details,
      } : undefined,
      
      createdAt: new Date((subscription as unknown as Record<string, unknown>).created as number * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      
      sessionHistory: [], // Would be populated from external session tracking system
    };

    console.log('✅ [SUBSCRIPTION] Retrieved subscription successfully');
    return NextResponse.json({ subscription: courseSubscription });

  } catch (error) {
    console.error('❌ [SUBSCRIPTION] Error retrieving subscription:', error);
    
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: `Stripe error: ${error.message}` },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to retrieve subscription' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/subscriptions/[subscriptionId]
 * Update subscription (plan changes, payment method, etc.)
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const stripe = getStripe();
    const { subscriptionId } = await params;
    const updateData: UpdateSubscriptionRequest = await request.json();

    console.log('🔄 [SUBSCRIPTION] Updating subscription:', subscriptionId);

    // Retrieve current subscription
    const currentSubscription = await stripe.subscriptions.retrieve(subscriptionId);
    
    const updateParams: Stripe.SubscriptionUpdateParams = {
      metadata: {
        ...currentSubscription.metadata,
        updatedAt: new Date().toISOString(),
      },
    };

    // Update payment method if provided
    if (updateData.paymentMethodId) {
      try {
        await stripe.paymentMethods.attach(updateData.paymentMethodId, {
          customer: currentSubscription.customer as string,
        });

        updateParams.default_payment_method = updateData.paymentMethodId;
        console.log('✅ [SUBSCRIPTION] Payment method updated');
      } catch (error) {
        console.error('❌ [SUBSCRIPTION] Failed to update payment method:', error);
        return NextResponse.json(
          { error: 'Failed to update payment method' },
          { status: 400 }
        );
      }
    }

    // Update plan if provided
    if (updateData.newPlan) {
      const newPlan = updateData.newPlan;
      
      // Create new price for the updated plan
      const newPriceId = `price_${newPlan.courseId}_${newPlan.sessionCustomization.sessionFormat}_${newPlan.sessionCustomization.sessionsPerWeek}x${newPlan.sessionCustomization.hoursPerSession}_updated`;
      
      let finalPriceId = newPriceId;
      
      try {
        await stripe.prices.retrieve(newPriceId);
        console.log('✅ [SUBSCRIPTION] Using existing price:', newPriceId);
      } catch {
        // Create new price if it doesn't exist
        const newPrice = await stripe.prices.create({
          product: `course_${newPlan.courseId}`,
          currency: newPlan.currency.toLowerCase(),
          recurring: {
            interval: newPlan.interval,
          },
          unit_amount: Math.round(newPlan.billingCalculation.monthlyTotal * 100),
          metadata: {
            courseId: newPlan.courseId,
            sessionsPerWeek: newPlan.sessionCustomization.sessionsPerWeek.toString(),
            hoursPerSession: newPlan.sessionCustomization.hoursPerSession.toString(),
            sessionFormat: newPlan.sessionCustomization.sessionFormat,
            baseHourlyRate: newPlan.billingCalculation.baseHourlyRate.toString(),
            adjustedHourlyRate: newPlan.billingCalculation.adjustedHourlyRate.toString(),
            hoursPerMonth: newPlan.billingCalculation.hoursPerMonth.toString(),
          },
        });
        finalPriceId = newPrice.id;
        console.log('✅ [SUBSCRIPTION] Created new price for plan update:', newPrice.id);
      }

      // Update subscription items
      updateParams.items = [
        {
          id: currentSubscription.items.data[0].id,
          price: finalPriceId,
        },
      ];

      // Update metadata with new plan details
      updateParams.metadata = {
        ...updateParams.metadata,
        planId: newPlan.id,
        sessionsPerWeek: newPlan.sessionCustomization.sessionsPerWeek.toString(),
        hoursPerSession: newPlan.sessionCustomization.hoursPerSession.toString(),
        sessionFormat: newPlan.sessionCustomization.sessionFormat,
        baseHourlyRate: newPlan.billingCalculation.baseHourlyRate.toString(),
        adjustedHourlyRate: newPlan.billingCalculation.adjustedHourlyRate.toString(),
        hoursPerMonth: newPlan.billingCalculation.hoursPerMonth.toString(),
      };

      // Handle proration for plan changes
      updateParams.proration_behavior = 'always_invoice';
    }

    // Update cancel_at_period_end if provided
    if (updateData.cancelAtPeriodEnd !== undefined) {
      updateParams.cancel_at_period_end = updateData.cancelAtPeriodEnd;
    }

    // Apply coupon if provided
    if (updateData.couponCode) {
      // For existing subscriptions, we need to apply discount via invoice items or subscription schedule
      // This is a more complex operation that would typically require creating a discount
      console.log('⚠️ [SUBSCRIPTION] Coupon application for existing subscriptions requires additional implementation');
      // TODO: Implement coupon application for existing subscriptions
    }

    // Perform the update
    const updatedSubscription = await stripe.subscriptions.update(subscriptionId, updateParams);

    console.log('✅ [SUBSCRIPTION] Updated subscription successfully');

    return NextResponse.json({
      success: true,
      subscription: {
        id: updatedSubscription.id,
        status: updatedSubscription.status,
        currentPeriodStart: new Date((updatedSubscription as unknown as Record<string, unknown>).current_period_start as number * 1000).toISOString(),
        currentPeriodEnd: new Date((updatedSubscription as unknown as Record<string, unknown>).current_period_end as number * 1000).toISOString(),
        cancelAtPeriodEnd: (updatedSubscription as unknown as Record<string, unknown>).cancel_at_period_end as boolean,
        updatedAt: new Date().toISOString(),
      },
      message: 'Subscription updated successfully',
    });

  } catch (error) {
    console.error('❌ [SUBSCRIPTION] Error updating subscription:', error);
    
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: `Stripe error: ${error.message}` },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update subscription' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/subscriptions/[subscriptionId]
 * Cancel subscription
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const stripe = getStripe();
    const { subscriptionId } = await params;
    const { searchParams } = new URL(request.url);
    const immediately = searchParams.get('immediately') === 'true';

    console.log('🔄 [SUBSCRIPTION] Canceling subscription:', subscriptionId, immediately ? 'immediately' : 'at period end');

    let canceledSubscription: Stripe.Subscription;

    if (immediately) {
      // Cancel immediately
      canceledSubscription = await stripe.subscriptions.cancel(subscriptionId);
    } else {
      // Cancel at period end
      canceledSubscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
        metadata: {
          canceledAt: new Date().toISOString(),
          cancelReason: 'customer_request',
        },
      });
    }

    console.log('✅ [SUBSCRIPTION] Subscription canceled successfully');

    return NextResponse.json({
      success: true,
      subscription: {
        id: canceledSubscription.id,
        status: canceledSubscription.status,
        cancelAtPeriodEnd: (canceledSubscription as unknown as Record<string, unknown>).cancel_at_period_end as boolean,
        canceledAt: (canceledSubscription as unknown as Record<string, unknown>).canceled_at ? 
          new Date((canceledSubscription as unknown as Record<string, unknown>).canceled_at as number * 1000).toISOString() : undefined,
        currentPeriodEnd: new Date((canceledSubscription as unknown as Record<string, unknown>).current_period_end as number * 1000).toISOString(),
      },
      message: immediately ? 'Subscription canceled immediately' : 'Subscription will cancel at the end of the current billing period',
    });

  } catch (error) {
    console.error('❌ [SUBSCRIPTION] Error canceling subscription:', error);
    
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: `Stripe error: ${error.message}` },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to cancel subscription' },
      { status: 500 }
    );
  }
}