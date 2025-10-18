'use client';

import React from 'react';
import { ServiceCategory } from '@/types/service';
import { FaCheck as Check } from 'react-icons/fa';
import Link from 'next/link';

interface DynamicServicePageProps {
  data: ServiceCategory;
}

export default function DynamicServicePage({ data }: DynamicServicePageProps) {
  const {
    title,
    description,
    mainImage,
    packages,
    faq: faqs,
    requirements,
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
                <Link 
                  href="/contact"
                  className="inline-block px-6 py-3 text-lg font-bold text-center bg-white text-blue-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Get Started Now
                </Link>
                <Link 
                  href="/portfolio"
                  className="inline-block px-6 py-3 text-lg font-bold text-center border-2 border-white text-white hover:bg-white hover:text-blue-900 rounded-lg transition-colors"
                >
                  View Portfolio
                </Link>
              </div>
            </div>
            {mainImage && (
              <div className="relative">
                <img
                  src={`https://cdn.sanity.io/images/puzezel0/production/${mainImage.asset._ref.replace('image-', '').replace('-jpg', '.jpg').replace('-png', '.png')}`}
                  alt={mainImage.alt || title}
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
                  key={pkg._key}
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
                        {pkg.currency}{pkg.price}
                      </span>
                    </div>
                    <p className="text-gray-600">{pkg.deliveryTime} delivery</p>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {pkg.features?.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link 
                    href="/contact"
                    className={`w-full inline-block text-center px-6 py-3 text-lg font-bold rounded-lg transition-colors ${
                      pkg.popular 
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
                    }`}
                  >
                    Choose {pkg.name}
                  </Link>
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
                    <Check className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-800">{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* FAQs Section */}
      {faqs && faqs.length > 0 && (
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
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-gray-700">
                    {faq.answer}
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
            <Link 
              href="/contact"
              className="inline-block px-6 py-3 text-lg font-bold text-center bg-white text-blue-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Start Your Project
            </Link>
            <Link 
              href="/contact"
              className="inline-block px-6 py-3 text-lg font-bold text-center border-2 border-white text-white hover:bg-white hover:text-blue-900 rounded-lg transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}