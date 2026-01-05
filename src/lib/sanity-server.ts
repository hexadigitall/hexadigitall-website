/**
 * Server-side Sanity client for use in API routes and server actions
 */

import { createClient } from '@sanity/client'

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN || '',
  useCdn: false,
})

/**
 * Create a user document in Sanity
 */
export async function createUser(data: {
  email: string
  name: string
  passwordHash: string
  salt: string
  role: 'student' | 'teacher' | 'admin'
  username?: string
}) {
  try {
    const user = await sanityClient.create({
      _type: 'user',
      email: data.email,
      name: data.name,
      username: data.username || data.email.split('@')[0],
      passwordHash: data.passwordHash,
      salt: data.salt,
      role: data.role,
      status: 'active',
      createdAt: new Date().toISOString(),
    })
    return user
  } catch (error) {
    console.error('Error creating user:', error)
    throw error
  }
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string) {
  try {
    const user = await sanityClient.fetch(
      `*[_type == "user" && email == $email][0]`,
      { email }
    )
    return user
  } catch (error) {
    console.error('Error fetching user:', error)
    return null
  }
}

/**
 * Create an enrollment document
 */
export async function createEnrollment(data: {
  courseId: string
  studentId?: string
  studentName: string
  studentEmail: string
  studentPhone: string
  courseType: 'self-paced' | 'live'
  amount: number
  currency: string
  paymentStatus: string
  paystackReference: string
  expiryDate: string
  [key: string]: unknown
}) {
  try {
    const enrollment = await sanityClient.create({
      _type: 'enrollment',
      courseId: {
        _type: 'reference',
        _ref: data.courseId,
      },
      studentId: data.studentId
        ? {
            _type: 'reference',
            _ref: data.studentId,
          }
        : undefined,
      studentName: data.studentName,
      studentEmail: data.studentEmail,
      studentPhone: data.studentPhone,
      courseType: data.courseType,
      amount: data.amount,
      currency: data.currency,
      paymentStatus: data.paymentStatus,
      paystackReference: data.paystackReference,
      expiryDate: data.expiryDate,
      enrolledAt: new Date().toISOString(),
      courseAccessGranted: data.paymentStatus === 'completed' || data.paymentStatus === 'active',
    })
    return enrollment
  } catch (error) {
    console.error('Error creating enrollment:', error)
    throw error
  }
}

/**
 * Get enrollment by student email and course
 */
export async function getEnrollmentByEmailAndCourse(
  studentEmail: string,
  courseId: string
) {
  try {
    const enrollment = await sanityClient.fetch(
      `*[_type == "enrollment" && studentEmail == $email && courseId._ref == $courseId][0]`,
      { email: studentEmail, courseId }
    )
    return enrollment
  } catch (error) {
    console.error('Error fetching enrollment:', error)
    return null
  }
}

/**
 * Update enrollment with renewal info
 */
export async function updateEnrollmentRenewal(
  enrollmentId: string,
  data: {
    expiryDate: string
    paystackReference: string
    amount: number
    paymentStatus: string
  }
) {
  try {
    const updated = await sanityClient
      .patch(enrollmentId)
      .set({
        expiryDate: data.expiryDate,
        paymentStatus: data.paymentStatus,
      })
      .append('renewalHistory', [
        {
          _key: `${Date.now()}`,
          renewalDate: new Date().toISOString(),
          paystackReference: data.paystackReference,
          amount: data.amount,
        },
      ])
      .commit()

    return updated
  } catch (error) {
    console.error('Error updating enrollment:', error)
    throw error
  }
}
