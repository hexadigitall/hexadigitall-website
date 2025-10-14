// src/types/subscription.ts
import { MonthlyBillingCalculation, SessionCustomization } from './course';

/**
 * Subscription Status Types
 */
export type SubscriptionStatus = 
  | 'incomplete'           // Payment method not set up
  | 'incomplete_expired'   // Setup intent expired
  | 'trialing'            // In trial period
  | 'active'              // Active subscription
  | 'past_due'            // Payment failed but still active
  | 'canceled'            // Canceled by customer
  | 'unpaid'              // Payment failed and subscription ended
  | 'paused';             // Temporarily paused

/**
 * Billing Interval Types
 */
export type BillingInterval = 'month' | 'year';

/**
 * Payment Method Information
 */
export interface PaymentMethod {
  id: string;
  type: string;
  card?: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
  billing_details?: {
    name?: string | null;
    email?: string | null;
    address?: {
      country?: string | null;
      postal_code?: string | null;
    } | null;
  };
}

/**
 * Subscription Plan Details
 */
export interface SubscriptionPlan {
  id: string;
  courseId: string;
  courseName: string;
  billingCalculation: MonthlyBillingCalculation;
  sessionCustomization: SessionCustomization;
  currency: string;
  interval: BillingInterval;
  trialPeriodDays?: number;
}

/**
 * Core Subscription Interface
 */
export interface CourseSubscription {
  id: string;
  stripeSubscriptionId: string;
  stripeCustomerId: string;
  courseId: string;
  studentId: string;
  
  // Plan details
  plan: SubscriptionPlan;
  
  // Status and lifecycle
  status: SubscriptionStatus;
  currentPeriodStart: string;  // ISO date string
  currentPeriodEnd: string;    // ISO date string
  cancelAtPeriodEnd: boolean;
  canceledAt?: string;         // ISO date string
  trialStart?: string;         // ISO date string
  trialEnd?: string;           // ISO date string
  
  // Pricing
  priceAmount: number;         // Amount in cents
  currency: string;
  
  // Payment
  defaultPaymentMethod?: PaymentMethod;
  latestInvoice?: SubscriptionInvoice;
  
  // Metadata
  createdAt: string;           // ISO date string
  updatedAt: string;           // ISO date string
  
  // Course-specific data
  sessionHistory: SessionRecord[];
  nextSessionScheduled?: string; // ISO date string
}

/**
 * Session Record for tracking completed sessions
 */
export interface SessionRecord {
  id: string;
  subscriptionId: string;
  scheduledDate: string;       // ISO date string
  completedDate?: string;      // ISO date string
  duration: number;            // minutes
  sessionFormat: 'one-on-one' | 'small-group' | 'large-group';
  instructorNotes?: string;
  studentFeedback?: string;
  status: 'scheduled' | 'completed' | 'missed' | 'canceled';
}

/**
 * Invoice Information
 */
export interface SubscriptionInvoice {
  id: string;
  stripeInvoiceId: string;
  subscriptionId: string;
  amount: number;              // Amount in cents
  currency: string;
  status: 'draft' | 'open' | 'paid' | 'uncollectible' | 'void';
  paidAt?: string;             // ISO date string
  dueDate?: string;            // ISO date string
  invoiceUrl?: string;
  hostedInvoiceUrl?: string;
  receiptUrl?: string;
}

/**
 * Subscription Creation Request
 */
export interface CreateSubscriptionRequest {
  courseId: string;
  studentDetails: {
    fullName: string;
    email: string;
    phone: string;
    experience?: string;
    goals?: string;
  };
  plan: SubscriptionPlan;
  paymentMethodId?: string;    // Stripe payment method ID
  trialPeriodDays?: number;
  couponCode?: string;
  
  // Scheduling preferences (optional)
  preferredSchedule?: {
    timeZone: string;
    daysOfWeek: string[];      // ['monday', 'wednesday', 'friday']
    preferredTimes: string[];   // ['morning', 'afternoon', 'evening']
  };
}

/**
 * Subscription Update Request
 */
export interface UpdateSubscriptionRequest {
  subscriptionId: string;
  newPlan?: SubscriptionPlan;
  paymentMethodId?: string;
  cancelAtPeriodEnd?: boolean;
  couponCode?: string;
  
  // Session customization updates
  sessionCustomization?: Partial<SessionCustomization>;
}

/**
 * Subscription Management Operations
 */
export interface SubscriptionOperations {
  // Core CRUD
  create: (request: CreateSubscriptionRequest) => Promise<CourseSubscription>;
  retrieve: (subscriptionId: string) => Promise<CourseSubscription>;
  update: (request: UpdateSubscriptionRequest) => Promise<CourseSubscription>;
  cancel: (subscriptionId: string, immediately?: boolean) => Promise<CourseSubscription>;
  
  // Lifecycle management
  pause: (subscriptionId: string) => Promise<CourseSubscription>;
  resume: (subscriptionId: string) => Promise<CourseSubscription>;
  changePlan: (subscriptionId: string, newPlan: SubscriptionPlan) => Promise<CourseSubscription>;
  
  // Payment management
  updatePaymentMethod: (subscriptionId: string, paymentMethodId: string) => Promise<CourseSubscription>;
  retryPayment: (subscriptionId: string) => Promise<SubscriptionInvoice>;
  
  // Session management
  scheduleSession: (subscriptionId: string, sessionDate: string) => Promise<SessionRecord>;
  completeSession: (sessionId: string, notes?: string) => Promise<SessionRecord>;
  rescheduleSession: (sessionId: string, newDate: string) => Promise<SessionRecord>;
}

/**
 * Webhook Event Types for Stripe
 */
export interface SubscriptionWebhookEvent {
  type: string;
  data: {
    object: Record<string, unknown>;
    previous_attributes?: Record<string, unknown>;
  };
  created: number;
  id: string;
}

/**
 * Customer Portal Configuration
 */
export interface CustomerPortalConfig {
  returnUrl: string;
  subscriptionId?: string;
  flowData?: {
    type: 'subscription_cancel' | 'payment_method_update' | 'subscription_update_confirm';
  };
}

/**
 * Subscription Analytics & Reporting
 */
export interface SubscriptionMetrics {
  subscriptionId: string;
  
  // Usage metrics
  totalSessionsScheduled: number;
  totalSessionsCompleted: number;
  totalHoursConsumed: number;
  averageSessionRating?: number;
  
  // Financial metrics
  totalAmountPaid: number;
  nextBillingAmount: number;
  nextBillingDate: string;
  
  // Status metrics
  daysActive: number;
  consecutivePayments: number;
  failedPaymentAttempts: number;
  
  // Calculated at runtime
  utilizationRate: number;      // sessions completed / sessions scheduled
  monthlyValue: number;         // total paid / months active
}

export default CourseSubscription;