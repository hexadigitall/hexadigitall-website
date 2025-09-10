// src/components/NewsletterSubscription.tsx
"use client";
import { useState, FormEvent } from 'react';

interface NewsletterSubscriptionProps {
  source?: string;
  className?: string;
  placeholder?: string;
}

export default function NewsletterSubscription({ 
  source = 'Footer Newsletter',
  className = '',
  placeholder = 'Enter your email'
}: NewsletterSubscriptionProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!email.trim()) {
      setStatus('error');
      setMessage('Please enter your email address');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), source }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Subscription failed');
      }

      setStatus('success');
      setMessage(data.message);
      setEmail(''); // Clear the input on success
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again later.');
    }
  };

  return (
    <div className={className}>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
        <div className="relative">
          <input 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder}
            disabled={status === 'loading'}
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors duration-300 disabled:opacity-50"
            aria-label="Email address for newsletter subscription"
          />
          {status === 'loading' && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            </div>
          )}
        </div>
        
        <button 
          type="submit" 
          disabled={status === 'loading' || !email.trim()}
          className="bg-accent hover:bg-accent/80 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-primary"
        >
          {status === 'loading' ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Subscribing...
            </span>
          ) : (
            'Subscribe'
          )}
        </button>
      </form>
      
      {message && (
        <div className={`mt-3 p-3 rounded-lg text-sm ${
          status === 'error' 
            ? 'bg-red-500/10 border border-red-500/20 text-red-200' 
            : 'bg-green-500/10 border border-green-500/20 text-green-200'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
}
