'use client';

import React from 'react';
import Image from 'next/image';
import { ServiceCategory } from '@/types/service';
import { IoCheckmark } from 'react-icons/io5';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface DynamicServicePageProps {
  data: ServiceCategory;
}

export default function DynamicServicePage({ data }: DynamicServicePageProps) {
  const {
    title,
    description,
    heroImage,
    packages,
    features,
    faq,
    requirements,
    processSteps
  } = data;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 to-purple-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                {title}
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                {description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-white text-blue-900 hover:bg-gray-100">
                  Get Started Now
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-white text-white hover:bg-white hover:text-blue-900"
                >
                  View Portfolio
                </Button>
              </div>
            </div>
            {heroImage && (
              <div className="relative">
                <Image
                  src={heroImage.url}
                  alt={heroImage.alt || title}
                  width={800}
                  height={600}
                  className="rounded-lg shadow-2xl"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      {packages && packages.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Choose Your Package
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Select the perfect plan that fits your needs and budget
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {packages.map((pkg) => (
                <div
                  key={pkg._key ?? pkg.name}
                  className={`bg-white rounded-xl shadow-lg p-8 relative ${
                      pkg.popular ? 'border-2 border-blue-500 transform scale-105' : ''
                  }`}
                >
                    {pkg.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {pkg.name}
                    </h3>
                    <div className="mb-4">
                      <span className="text-5xl font-bold text-blue-600">
                        ${pkg.price}
                      </span>
                      {pkg.originalPrice && pkg.originalPrice > pkg.price && (
                        <span className="text-lg text-gray-500 line-through ml-2">
                          ${pkg.originalPrice}
                        </span>
                      )}
                    </div>
                    {pkg.description && (
                      <p className="text-gray-600">{pkg.description}</p>
                    )}
                  </div>

                  <ul className="space-y-4 mb-8">
                    {pkg.features?.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <IoCheckmark className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">
                          {typeof feature === 'string'
                            ? feature
                            : feature?.title || feature?.description || JSON.stringify(feature)}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className="w-full" 
                    variant={pkg.popular ? "default" : "outline"}
                    size="lg"
                  >
                    Choose {pkg.name}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      {features && features.length > 0 && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                What&apos;s Included
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Comprehensive features designed to deliver exceptional results
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="text-center p-6">
                  <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <IoCheckmark className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {typeof feature === 'string' ? feature : feature?.title}
                  </h3>
                  <p className="text-gray-600">
                    {typeof feature === 'string' ? '' : feature?.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Process Steps Section */}
      {processSteps && processSteps.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Our Process
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Step-by-step approach to delivering exceptional results
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {processSteps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {step?.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {step?.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Requirements Section */}
      {requirements && requirements.length > 0 && (
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                What We Need From You
              </h2>
              <p className="text-xl text-gray-600">
                To get started, please prepare the following information
              </p>
            </div>

            <div className="bg-blue-50 rounded-xl p-8">
              <ul className="space-y-4">
                {requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start">
                    <IoCheckmark className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-800">{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* FAQs Section */}
      {faq && faq.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-gray-600">
                Get answers to common questions about our services
              </p>
            </div>

            <div className="space-y-6">
              {faq.map((faqItem, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {faqItem.question}
                  </h3>
                  <p className="text-gray-700">
                    {faqItem.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Let&apos;s discuss your project and create something amazing together
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-900 hover:bg-gray-100">
              Start Your Project
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-white text-white hover:bg-white hover:text-blue-900"
            >
              <Link href="/contact">
                Contact Us
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}