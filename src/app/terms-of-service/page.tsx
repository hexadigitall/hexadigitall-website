// src/app/terms-of-service/page.tsx

import type { Metadata } from 'next';
import { generateMetadata, generateBreadcrumbSchema } from '@/lib/seo';
import { generateStructuredData } from '@/lib/structured-data';

export const metadata: Metadata = generateMetadata({
  title: 'Terms of Service - Usage Terms & Conditions',
  description: 'Read the terms and conditions for using Hexadigitall services. Comprehensive terms covering service usage, payment terms, intellectual property, and legal obligations.',
  keywords: [
    'terms of service',
    'terms and conditions',
    'service agreement',
    'usage terms',
    'legal terms',
    'service conditions',
    'user agreement',
    'contract terms'
  ],
  path: '/terms-of-service',
  type: 'article'
});

export default function TermsOfServicePage() {
  const breadcrumbItems = [
    { name: 'Home', url: 'https://hexadigitall.com' },
    { name: 'Terms of Service', url: 'https://hexadigitall.com/terms-of-service' }
  ];

  const lastUpdated = new Date('2025-01-01');
  const effectiveDate = new Date('2025-01-01');

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
              <li><a href="/" className="hover:text-primary transition-colors">Home</a></li>
              <li className="text-gray-400">/</li>
              <li className="text-primary font-medium" aria-current="page">Terms of Service</li>
            </ol>
          </nav>

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-heading text-primary mb-4">
              Terms of Service
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Please read these terms carefully before using our services. By using our services, you agree to be bound by these terms.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-4 text-sm text-gray-500">
              <p>Last updated: {lastUpdated.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p>Effective: {effectiveDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            
            {/* Introduction */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold font-heading text-primary mb-4">1. Agreement to Terms</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                These Terms of Service ("Terms") constitute a legally binding agreement between you ("User," "you," or "your") and Hexadigitall ("Company," "we," "our," or "us") regarding your use of our website, services, and products.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                By accessing, browsing, or using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, please do not use our services.
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                <p className="text-blue-800">
                  <strong>Important:</strong> These Terms may be updated from time to time. Your continued use of our services after any changes constitutes acceptance of the new Terms.
                </p>
              </div>
            </section>

            {/* Description of Services */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold font-heading text-primary mb-4">2. Description of Services</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Hexadigitall provides comprehensive digital solutions including:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li><strong>Business Planning & Strategy:</strong> Business plan development, market research, and strategic consulting</li>
                <li><strong>Web & Mobile Development:</strong> Custom website and mobile application development</li>
                <li><strong>Digital Marketing:</strong> Social media marketing, advertising campaigns, and brand development</li>
                <li><strong>Logo & Brand Design:</strong> Professional logo design and brand identity creation</li>
                <li><strong>Portfolio Development:</strong> Professional portfolio and profile building services</li>
                <li><strong>Educational Services:</strong> Online courses, training programs, and mentoring services</li>
                <li><strong>Consulting Services:</strong> Business consulting, technical guidance, and strategic advice</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to modify, suspend, or discontinue any aspect of our services at any time without prior notice.
              </p>
            </section>

            {/* Eligibility */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold font-heading text-primary mb-4">3. Eligibility and Registration</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.1 Age Requirements</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                You must be at least 18 years old to use our services. If you are under 18, you may only use our services with the involvement and consent of a parent or legal guardian.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.2 Account Registration</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                For certain services, you may be required to create an account. You agree to:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Update your information promptly when it changes</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized use</li>
              </ul>
            </section>

            {/* Acceptable Use */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold font-heading text-primary mb-4">4. Acceptable Use Policy</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">4.1 Permitted Uses</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                You may use our services for lawful business and personal purposes in accordance with these Terms.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">4.2 Prohibited Activities</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                You agree not to:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Use our services for any illegal or unauthorized purpose</li>
                <li>Violate any local, state, national, or international laws</li>
                <li>Transmit viruses, malware, or other harmful code</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with or disrupt our services or servers</li>
                <li>Use automated scripts or bots without permission</li>
                <li>Impersonate any person or entity</li>
                <li>Collect or harvest personal information from other users</li>
                <li>Post or transmit spam, advertising, or promotional materials</li>
                <li>Infringe on intellectual property rights of others</li>
              </ul>
            </section>

            {/* Payment Terms */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold font-heading text-primary mb-4">5. Payment Terms and Billing</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">5.1 Pricing and Fees</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Service pricing is clearly stated on our website and service agreements. Prices are subject to change with prior notice. All prices are in Nigerian Naira (NGN) or US Dollars (USD) unless otherwise specified.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">5.2 Payment Methods</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We accept various payment methods including bank transfers, credit/debit cards, and digital payment platforms. Payment processing is handled by secure third-party providers.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">5.3 Payment Terms</h3>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Payment is due within 30 days of invoice date unless otherwise agreed</li>
                <li>Late payments may incur additional fees</li>
                <li>Services may be suspended for non-payment</li>
                <li>All payments are non-refundable unless specified otherwise</li>
                <li>You are responsible for all taxes related to your purchases</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">5.4 Refund Policy</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Refunds are considered on a case-by-case basis. Digital products and completed services are generally non-refundable. For ongoing services, refunds may be prorated based on unused services.
              </p>
            </section>

            {/* Intellectual Property */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold font-heading text-primary mb-4">6. Intellectual Property Rights</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">6.1 Our Intellectual Property</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                All content, materials, and intellectual property on our website and in our services, including but not limited to text, graphics, logos, images, software, and design elements, are owned by or licensed to Hexadigitall and are protected by copyright, trademark, and other intellectual property laws.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">6.2 Client Work Product</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Upon full payment for services, you will own the final deliverables specifically created for you. However, we retain the right to:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Use general knowledge, skills, and experience gained</li>
                <li>Retain and use work processes, methodologies, and techniques</li>
                <li>Use work samples in our portfolio (with permission)</li>
                <li>Retain pre-existing intellectual property used in your project</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">6.3 User Content</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                You retain ownership of content you provide to us. By submitting content, you grant us a non-exclusive license to use, modify, and distribute it as necessary to provide our services.
              </p>
            </section>

            {/* Privacy and Data */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold font-heading text-primary mb-4">7. Privacy and Data Protection</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference. By using our services, you consent to our Privacy Policy.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                We implement appropriate security measures to protect your information, but we cannot guarantee absolute security. You are responsible for maintaining the confidentiality of your account information.
              </p>
            </section>

            {/* Service Delivery */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold font-heading text-primary mb-4">8. Service Delivery and Performance</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">8.1 Project Timelines</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Project timelines are estimates and may vary based on project complexity, client feedback, and external factors. We will communicate any significant delays promptly.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">8.2 Client Responsibilities</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Timely project completion depends on your cooperation, including:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Providing necessary information and materials</li>
                <li>Responding to requests for feedback within agreed timeframes</li>
                <li>Making timely decisions and approvals</li>
                <li>Providing access to required systems or accounts</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">8.3 Revisions and Changes</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Minor revisions are typically included in our services. Major changes or additional scope may require separate agreements and additional fees.
              </p>
            </section>

            {/* Disclaimers */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold font-heading text-primary mb-4">9. Disclaimers and Warranties</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">9.1 Service Disclaimer</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our services are provided "as is" without warranties of any kind, either express or implied. While we strive for excellence, we cannot guarantee specific outcomes or results from our services.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">9.2 Third-Party Services</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may recommend or integrate third-party services. We are not responsible for the availability, content, or practices of third-party services.
              </p>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <p className="text-yellow-800">
                  <strong>Limitation of Liability:</strong> Our liability for any claims related to our services is limited to the amount you paid for the specific service giving rise to the claim.
                </p>
              </div>
            </section>

            {/* Termination */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold font-heading text-primary mb-4">10. Termination</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">10.1 Termination by You</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                You may terminate ongoing services with 30 days written notice. You remain responsible for payment of services rendered up to the termination date.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">10.2 Termination by Us</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may terminate or suspend services immediately for:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Violation of these Terms</li>
                <li>Non-payment of fees</li>
                <li>Illegal or harmful activities</li>
                <li>Abusive behavior toward our staff</li>
                <li>Any reason with 30 days notice</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">10.3 Effect of Termination</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Upon termination, your right to use our services ceases immediately. You remain liable for all charges incurred before termination. We will provide final deliverables for paid work upon request.
              </p>
            </section>

            {/* Governing Law */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold font-heading text-primary mb-4">11. Governing Law and Disputes</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">11.1 Governing Law</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                These Terms are governed by the laws of the Federal Republic of Nigeria. Any disputes will be resolved in the courts of Cross River State, Nigeria.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">11.2 Dispute Resolution</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We encourage resolving disputes through direct communication. For formal disputes, we prefer mediation before litigation. You agree to attempt good faith resolution of any disputes before taking legal action.
              </p>
            </section>

            {/* Miscellaneous */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold font-heading text-primary mb-4">12. Miscellaneous</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">12.1 Entire Agreement</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                These Terms, together with our Privacy Policy and any written service agreements, constitute the entire agreement between you and Hexadigitall.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">12.2 Changes to Terms</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may update these Terms from time to time. Material changes will be communicated via email or website notice. Continued use after changes constitutes acceptance.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">12.3 Severability</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                If any provision of these Terms is found to be unenforceable, the remaining provisions will continue in full force and effect.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">12.4 Assignment</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                You may not transfer or assign your rights or obligations under these Terms without our written consent. We may assign our rights and obligations without restriction.
              </p>
            </section>

            {/* Contact Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold font-heading text-primary mb-4">13. Contact Information</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <strong>Hexadigitall</strong><br />
                    Email: <a href="mailto:legal@hexadigitall.com" className="text-primary hover:text-secondary">legal@hexadigitall.com</a><br />
                    General: <a href="mailto:hexadigitztech@gmail.com" className="text-primary hover:text-secondary">hexadigitztech@gmail.com</a><br />
                    Phone: <a href="tel:+2348125802140" className="text-primary hover:text-secondary">+234 812 580 2140</a><br />
                    Address: Calabar, Cross River, Nigeria
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                Please allow up to 5 business days for a response to legal inquiries.
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
