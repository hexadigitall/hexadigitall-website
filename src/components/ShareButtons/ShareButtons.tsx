'use client';

/**
 * ShareButtons Component
 * 
 * A reusable component for sharing content on social media platforms.
 * Supports Facebook, Twitter, LinkedIn, WhatsApp, and Email sharing.
 */

import React, { useState } from 'react';
import { 
  FaFacebook, 
  FaTwitter, 
  FaLinkedin, 
  FaWhatsapp, 
  FaEnvelope,
  FaLink,
  FaCheck,
} from 'react-icons/fa';
import { generateShareUrls } from '@/lib/og';

export interface ShareButtonsProps {
  /** The URL to share */
  url: string;
  /** Title of the content being shared */
  title?: string;
  /** Description of the content being shared */
  description?: string;
  /** Show labels next to icons (default: false) */
  showLabels?: boolean;
  /** Button size: 'sm' | 'md' | 'lg' (default: 'md') */
  size?: 'sm' | 'md' | 'lg';
  /** Layout: 'horizontal' | 'vertical' (default: 'horizontal') */
  layout?: 'horizontal' | 'vertical';
  /** Custom CSS classes */
  className?: string;
  /** Platforms to show (default: all) */
  platforms?: ('facebook' | 'twitter' | 'linkedin' | 'whatsapp' | 'email' | 'copy')[];
}

const ShareButtons: React.FC<ShareButtonsProps> = ({
  url,
  title = '',
  description = '',
  showLabels = false,
  size = 'md',
  layout = 'horizontal',
  className = '',
  platforms = ['facebook', 'twitter', 'linkedin', 'whatsapp', 'email', 'copy'],
}) => {
  const [copied, setCopied] = useState(false);
  const shareUrls = generateShareUrls(url, title, description);

  const handleShare = (platform: string) => {
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = shareUrls.facebook;
        break;
      case 'twitter':
        shareUrl = shareUrls.twitter;
        break;
      case 'linkedin':
        shareUrl = shareUrls.linkedin;
        break;
      case 'whatsapp':
        shareUrl = shareUrls.whatsapp;
        break;
      case 'email':
        shareUrl = shareUrls.email;
        break;
      default:
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=600');
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Size classes
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
  };

  // Layout classes
  const layoutClasses = {
    horizontal: 'flex-row flex-wrap',
    vertical: 'flex-col',
  };

  // Platform configurations
  const platformConfig = {
    facebook: {
      icon: FaFacebook,
      label: 'Facebook',
      color: 'bg-[#1877F2] hover:bg-[#0C63D4]',
      action: () => handleShare('facebook'),
    },
    twitter: {
      icon: FaTwitter,
      label: 'Twitter',
      color: 'bg-[#1DA1F2] hover:bg-[#0D8BD9]',
      action: () => handleShare('twitter'),
    },
    linkedin: {
      icon: FaLinkedin,
      label: 'LinkedIn',
      color: 'bg-[#0A66C2] hover:bg-[#004182]',
      action: () => handleShare('linkedin'),
    },
    whatsapp: {
      icon: FaWhatsapp,
      label: 'WhatsApp',
      color: 'bg-[#25D366] hover:bg-[#1EBE57]',
      action: () => handleShare('whatsapp'),
    },
    email: {
      icon: FaEnvelope,
      label: 'Email',
      color: 'bg-gray-600 hover:bg-gray-700',
      action: () => handleShare('email'),
    },
    copy: {
      icon: copied ? FaCheck : FaLink,
      label: copied ? 'Copied!' : 'Copy Link',
      color: copied ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700',
      action: handleCopyLink,
    },
  };

  return (
    <div 
      className={`flex gap-2 ${layoutClasses[layout]} ${className}`}
      role="group"
      aria-label="Share on social media"
    >
      {platforms.map((platform) => {
        const config = platformConfig[platform];
        if (!config) return null;

        const Icon = config.icon;

        return (
          <button
            key={platform}
            onClick={config.action}
            className={`
              ${sizeClasses[size]}
              ${config.color}
              text-white
              rounded-full
              flex items-center justify-center
              transition-all duration-200
              transform hover:scale-110
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
              shadow-md hover:shadow-lg
              ${showLabels ? 'px-4 gap-2 w-auto rounded-lg' : ''}
            `}
            aria-label={`Share on ${config.label}`}
            title={`Share on ${config.label}`}
          >
            <Icon className={showLabels ? '' : 'mx-auto'} />
            {showLabels && <span className="text-sm font-medium">{config.label}</span>}
          </button>
        );
      })}
    </div>
  );
};

export default ShareButtons;
