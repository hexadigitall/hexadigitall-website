// src/app/privacy-policy/page.tsx

import type { Metadata } from 'next';
import Link from 'next/link';
import { generateMetadata, generateBreadcrumbSchema } from '@/lib/seo';
import { generateStructuredData } from '@/lib/structured-data';

export const metadata: Metadata = generateMetadata({
  title: 'Privacy Policy - Your Data Protection Rights',
  description: 'Learn how Hexadigitall protects your privacy and personal data. Comprehensive privacy policy covering data collection, usage, storage, and your rights under Nigerian and international data protection laws.',
  keywords: [
    'privacy policy',
    'data protection',
    'personal information',
    'cookies',
    'GDPR compliance',
    'Nigeria data protection',
    'digital privacy rights',
    'information security'
  ],
  path: '/privacy-policy',
  type: 'article'
});

export default function PrivacyPolicyPage() {
  const breadcrumbItems = [
    { name: 'Home', url: 'https://hexadigitall.com' },
    { name: 'Privacy Policy', url: 'https://hexadigitall.com/privacy-policy' }
  ];

  const lastUpdated = new Date('2025-01-01');

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: generateStructuredData(generateBreadcrumbSchema(breadcrumbItems)),
        }}
      />
      
      <div className="bg-white py-12 md:py-20">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Breadcrumb Navigation */}
          <nav className="mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-gray-600">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li className="text-gray-400">/</li>
              <li className="text-primary font-medium" aria-current="page">Privacy Policy</li>
            </ol>
          </nav>

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-heading text-primary mb-4">
              Privacy Policy
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Last updated: {lastUpdated.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            
            {/* Introduction */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold font-heading text-primary mb-4">1. Introduction</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Welcome to Hexadigitall (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our services, or interact with us.
              </p>
              <p className="text-gray-700 leading-relaxed">
                By using our services, you agree to the collection and use of information in accordance with this policy. We will not use or share your information except as described in this Privacy Policy.
              </p>
            </section>

            {/* Information We Collect */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold font-heading text-primary mb-4">2. Information We Collect</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">2.1 Personal Information</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may collect personal information that you voluntarily provide to us when you:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Fill out contact forms or request information</li>
                <li>Subscribe to our newsletter or updates</li>
                <li>Purchase courses or services</li>
                <li>Register for consultations</li>
                <li>Participate in surveys or feedback forms</li>
                <li>Apply for jobs or submit portfolios</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">2.2 Technical Information</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We automatically collect certain information when you visit our website:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>IP address and location data</li>
                <li>Browser type and version</li>
                <li>Device information and screen resolution</li>
                <li>Pages visited and time spent on our site</li>
                <li>Referral sources and exit pages</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>

            {/* How We Use Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold font-heading text-primary mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We use the information we collect for various purposes:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>To provide, maintain, and improve our services</li>
                <li>To process transactions and send related information</li>
                <li>To send periodic emails about our services and updates</li>
                <li>To respond to your inquiries and provide customer support</li>
                <li>To personalize your experience on our website</li>
                <li>To analyze website usage and improve functionality</li>
                <li>To detect, prevent, and address technical issues</li>
                <li>To comply with legal obligations and protect our rights</li>
              </ul>
            </section>

            {/* Information Sharing */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold font-heading text-primary mb-4">4. Information Sharing and Disclosure</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">4.1 Service Providers</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may employ third-party companies and individuals to facilitate our services, including:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Website hosting and maintenance</li>
                <li>Email delivery services</li>
                <li>Payment processing (Stripe, PayPal)</li>
                <li>Analytics services (Google Analytics)</li>
                <li>Customer support tools</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">4.2 Legal Requirements</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may disclose your information if required by law or in response to valid legal requests, such as court orders or government investigations.
              </p>
            </section>

            {/* Data Security */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold font-heading text-primary mb-4">5. Data Security</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We implement appropriate technical and organizational security measures to protect your personal information:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>SSL/TLS encryption for data transmission</li>
                <li>Secure servers and regular security updates</li>
                <li>Access controls and employee training</li>
                <li>Regular security audits and monitoring</li>
                <li>Data backup and recovery procedures</li>
              </ul>
              <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-4">
                <p className="text-amber-800">
                  <strong>Note:</strong> While we strive to protect your information, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security of your data.
                </p>
              </div>
            </section>

            {/* Cookies */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold font-heading text-primary mb-4">6. Cookies and Tracking Technologies</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our website uses cookies and similar technologies to enhance your browsing experience:
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">6.1 Types of Cookies We Use</h3>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li><strong>Essential Cookies:</strong> Required for website functionality</li>
                <li><strong>Analytics Cookies:</strong> Help us understand website usage</li>
                <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                <li><strong>Marketing Cookies:</strong> Used for targeted advertising (with your consent)</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">6.2 Managing Cookies</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                You can control cookies through your browser settings. However, disabling certain cookies may limit website functionality.
              </p>
            </section>

            {/* Your Rights */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold font-heading text-primary mb-4">7. Your Privacy Rights</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                You have the following rights regarding your personal information:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li><strong>Access:</strong> Request access to your personal data</li>
                <li><strong>Rectification:</strong> Request correction of inaccurate information</li>
                <li><strong>Erasure:</strong> Request deletion of your personal data</li>
                <li><strong>Portability:</strong> Request transfer of your data to another service</li>
                <li><strong>Restriction:</strong> Request restriction of processing</li>
                <li><strong>Objection:</strong> Object to processing of your personal data</li>
                <li><strong>Withdraw Consent:</strong> Withdraw consent for data processing</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                To exercise these rights, please contact us at{' '}
                <a href="mailto:privacy@hexadigitall.com" className="text-primary hover:text-secondary">
                  privacy@hexadigitall.com
                </a>
              </p>
            </section>

            {/* Data Retention */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold font-heading text-primary mb-4">8. Data Retention</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We retain your personal information only for as long as necessary to:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Provide our services to you</li>
                <li>Comply with legal obligations</li>
                <li>Resolve disputes and enforce agreements</li>
                <li>Maintain business records as required by law</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                When data is no longer needed, we securely delete or anonymize it.
              </p>
            </section>

            {/* International Transfers */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold font-heading text-primary mb-4">9. International Data Transfers</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Your information may be transferred to and processed in countries other than Nigeria, including the United States and European Union, where our service providers are located. We ensure appropriate safeguards are in place to protect your data during international transfers.
              </p>
            </section>

            {/* Children's Privacy */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold font-heading text-primary mb-4">10. Children&apos;s Privacy</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our services are not directed to children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
              </p>
            </section>

            {/* Changes to Policy */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold font-heading text-primary mb-4">11. Changes to This Privacy Policy</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any changes by:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Posting the new Privacy Policy on this page</li>
                <li>Updating the &quot;Last updated&quot; date</li>
                <li>Sending email notifications for significant changes</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                Your continued use of our services after changes take effect constitutes acceptance of the updated policy.
              </p>
            </section>

            {/* Contact Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold font-heading text-primary mb-4">12. Contact Us</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any questions about this Privacy Policy or our privacy practices, please contact us:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <strong>Hexadigitall</strong><br />
                    Email: <a href="mailto:privacy@hexadigitall.com" className="text-primary hover:text-secondary">privacy@hexadigitall.com</a><br />
                    General: <a href="mailto:hexadigitztech@gmail.com" className="text-primary hover:text-secondary">hexadigitztech@gmail.com</a><br />
                    Phone: <a href="tel:+2348125802140" className="text-primary hover:text-secondary">+234 812 580 2140</a><br />
                    Address: Calabar, Cross River, Nigeria
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
