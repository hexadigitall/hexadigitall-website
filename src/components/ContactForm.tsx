// src/components/ContactForm.tsx
"use client";
import { useState, FormEvent } from 'react';

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    service: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Network response was not ok');
      }

      setStatus('success');
      setMessage(data.message);
      setFormData({ name: '', email: '', message: '', service: '' }); // Reset form
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again later.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
        <input 
          type="text" 
          name="name" 
          id="name" 
          value={formData.name}
          onChange={handleInputChange}
          required 
          disabled={status === 'loading'}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary disabled:opacity-50 disabled:bg-gray-50" 
        />
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
        <input 
          type="email" 
          name="email" 
          id="email" 
          value={formData.email}
          onChange={handleInputChange}
          required 
          disabled={status === 'loading'}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary disabled:opacity-50 disabled:bg-gray-50" 
        />
      </div>
      
      <div>
        <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">Service Interest (Optional)</label>
        <select 
          name="service" 
          id="service" 
          value={formData.service}
          onChange={handleInputChange}
          disabled={status === 'loading'}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary disabled:opacity-50 disabled:bg-gray-50"
        >
          <option value="">Select a service (optional)</option>
          <option value="Business Plan & Logo Design">Business Plan & Logo Design</option>
          <option value="Web & Mobile Development">Web & Mobile Development</option>
          <option value="Digital Marketing">Digital Marketing</option>
          <option value="Profile & Portfolio Building">Profile & Portfolio Building</option>
          <option value="Mentoring & Consulting">Mentoring & Consulting</option>
          <option value="Course Enrollment">Course Enrollment</option>
          <option value="Other">Other</option>
        </select>
      </div>
      
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Your Message *</label>
        <textarea 
          name="message" 
          id="message" 
          value={formData.message}
          onChange={handleInputChange}
          rows={4} 
          required 
          disabled={status === 'loading'}
          placeholder="Tell us about your project or how we can help you..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary disabled:opacity-50 disabled:bg-gray-50"
        />
      </div>
      
      <div>
        <button 
          type="submit" 
          disabled={status === 'loading' || !formData.name.trim() || !formData.email.trim() || !formData.message.trim()}
          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-secondary hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300"
        >
          {status === 'loading' ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending Message...
            </>
          ) : (
            'Send Message'
          )}
        </button>
      </div>
      
      {message && (
        <div className={`p-4 rounded-lg ${status === 'error' ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
          <p className={`text-center ${status === 'error' ? 'text-red-700' : 'text-green-700'}`}>
            {message}
          </p>
        </div>
      )}
    </form>
  );
}