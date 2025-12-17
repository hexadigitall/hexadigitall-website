/**
 * Open Graph Meta Tags Tests
 * 
 * Tests to validate that OG meta tags are properly generated
 * for server-side rendering and social media crawlers.
 */

import { describe, it, expect } from '@jest/globals';
import { generateOGMetadata, getAbsoluteUrl, validateOGImage, generateShareUrls } from '@/lib/og';

describe('Open Graph Helpers', () => {
  describe('getAbsoluteUrl', () => {
    it('should generate absolute URLs correctly', () => {
      const url = getAbsoluteUrl('/demo/jhema-wears');
      expect(url).toContain('http');
      expect(url).toContain('/demo/jhema-wears');
    });

    it('should handle paths with and without leading slash', () => {
      const url1 = getAbsoluteUrl('/test');
      const url2 = getAbsoluteUrl('test');
      expect(url1).toEqual(url2);
    });
  });

  describe('generateOGMetadata', () => {
    it('should generate complete OG metadata with all required fields', () => {
      const metadata = generateOGMetadata({
        title: 'Test Page',
        description: 'Test description',
        url: '/test',
        image: {
          url: '/test-image.jpg',
          width: 1200,
          height: 630,
          alt: 'Test Image',
        },
      });

      expect(metadata.title).toBe('Test Page');
      expect(metadata.description).toBe('Test description');
      expect(metadata.openGraph).toBeDefined();
      expect(metadata.openGraph?.title).toBe('Test Page');
      expect(metadata.openGraph?.description).toBe('Test description');
      expect(metadata.openGraph?.images).toBeDefined();
      expect(metadata.twitter).toBeDefined();
      expect(metadata.twitter?.card).toBe('summary_large_image');
      expect(metadata.alternates?.canonical).toBeDefined();
    });

    it('should include image with secure URL', () => {
      const metadata = generateOGMetadata({
        title: 'Test',
        description: 'Test',
        url: '/test',
        image: {
          url: '/image.jpg',
        },
      });

      const images = metadata.openGraph?.images as Array<{ url: string; secureUrl?: string }>;
      expect(images).toBeDefined();
      expect(images.length).toBeGreaterThan(0);
      expect(images[0].url).toBeDefined();
      expect(images[0].secureUrl).toBeDefined();
    });

    it('should set article type for blog posts', () => {
      const metadata = generateOGMetadata({
        title: 'Blog Post',
        description: 'A blog post',
        url: '/blog/test',
        type: 'article',
        publishedTime: '2024-01-01',
        authors: ['John Doe'],
      });

      expect(metadata.openGraph?.type).toBe('article');
      expect(metadata.openGraph?.publishedTime).toBe('2024-01-01');
      expect(metadata.openGraph?.authors).toEqual(['John Doe']);
    });
  });

  describe('validateOGImage', () => {
    it('should validate correct OG image dimensions', () => {
      const result = validateOGImage({
        url: '/image.jpg',
        width: 1200,
        height: 630,
        alt: 'Test Image',
        type: 'image/jpeg',
      });

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject images that are too small', () => {
      const result = validateOGImage({
        url: '/image.jpg',
        width: 100,
        height: 100,
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('200');
    });

    it('should warn about non-optimal dimensions', () => {
      const result = validateOGImage({
        url: '/image.jpg',
        width: 600,
        height: 400,
      });

      expect(result.warnings.length).toBeGreaterThan(0);
    });

    it('should require URL', () => {
      const result = validateOGImage({
        url: '',
      });

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Image URL is required');
    });
  });

  describe('generateShareUrls', () => {
    const testUrl = 'https://hexadigitall.com/test';
    const testTitle = 'Test Title';
    const testDescription = 'Test Description';

    it('should generate Facebook share URL', () => {
      const urls = generateShareUrls(testUrl, testTitle, testDescription);
      expect(urls.facebook).toContain('facebook.com');
      expect(urls.facebook).toContain(encodeURIComponent(testUrl));
    });

    it('should generate Twitter share URL', () => {
      const urls = generateShareUrls(testUrl, testTitle, testDescription);
      expect(urls.twitter).toContain('twitter.com');
      expect(urls.twitter).toContain(encodeURIComponent(testUrl));
      expect(urls.twitter).toContain(encodeURIComponent(testTitle));
    });

    it('should generate LinkedIn share URL', () => {
      const urls = generateShareUrls(testUrl, testTitle, testDescription);
      expect(urls.linkedin).toContain('linkedin.com');
      expect(urls.linkedin).toContain(encodeURIComponent(testUrl));
    });

    it('should generate WhatsApp share URL', () => {
      const urls = generateShareUrls(testUrl, testTitle, testDescription);
      expect(urls.whatsapp).toContain('wa.me');
      expect(urls.whatsapp).toContain(encodeURIComponent(testUrl));
    });

    it('should generate email share URL', () => {
      const urls = generateShareUrls(testUrl, testTitle, testDescription);
      expect(urls.email).toContain('mailto:');
      expect(urls.email).toContain(encodeURIComponent(testTitle));
      expect(urls.email).toContain(encodeURIComponent(testUrl));
    });

    it('should handle missing optional parameters', () => {
      const urls = generateShareUrls(testUrl);
      expect(urls.facebook).toBeDefined();
      expect(urls.twitter).toBeDefined();
      expect(urls.linkedin).toBeDefined();
      expect(urls.whatsapp).toBeDefined();
      expect(urls.email).toBeDefined();
    });
  });
});

describe('Jhema Wears Demo Page Metadata', () => {
  it('should have correct metadata structure for demo page', () => {
    const metadata = generateOGMetadata({
      title: 'Jhema Wears - Premium Fashion Collection',
      description: 'Discover our exclusive collection of premium fashion items.',
      url: '/demo/jhema-wears',
      type: 'website',
      image: {
        url: '/digitall_partner.png',
        width: 1200,
        height: 630,
        alt: 'Jhema Wears Fashion Collection',
      },
    });

    expect(metadata.title).toContain('Jhema Wears');
    expect(metadata.description).toContain('fashion');
    expect(metadata.openGraph?.type).toBe('website');
    
    const images = metadata.openGraph?.images as Array<{ width?: number; height?: number }>;
    expect(images).toBeDefined();
    expect(images[0].width).toBe(1200);
    expect(images[0].height).toBe(630);
  });
});
