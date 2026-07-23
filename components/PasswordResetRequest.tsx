import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SectionWrapper from './SectionWrapper';
import { requestPasswordReset } from '../lib/supabaseClient';
import { ArrowLeftIcon, MailIcon, AlertCircleIcon, CheckCircleIcon, Loader2Icon } from './icons';

interface PasswordResetRequestProps {
  onBackToLogin?: () => void;
}

export function PasswordResetRequest({ onBackToLogin }: PasswordResetRequestProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleBackToLogin = () => {
    if (onBackToLogin) {
      onBackToLogin();
    } else {
      navigate('/');
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setStatus('loading');

    try {
      const response = await requestPasswordReset(email.trim().toLowerCase());
      
      setStatus('success');
      setMessage(response.message || 'If an account with that email exists, a password reset link has been sent.');
    } catch (err) {
      // Even if the email doesn't exist, we show success for security
      setStatus('success');
      setMessage('If an account with that email exists, a password reset link has been sent.');
    }
  };

  return (
    <SectionWrapper className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-zinc-950">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center relative pt-12">
          <button
            onClick={handleBackToLogin}
            className="absolute left-0 top-4 z-10 flex items-center text-zinc-400 hover:text-white transition-colors"
            aria-label="Back to login"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span className="ml-1 text-sm">Back to Login</span>
          </button>
          <h2 className="mt-2 text-3xl font-extrabold text-white">Forgot your password?</h2>
          <p className="mt-2 text-sm text-zinc-400">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <div className="relative">
                <MailIcon className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500 w-5 h-5" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-zinc-700 placeholder-zinc-500 text-white bg-zinc-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  disabled={status === 'loading' || status === 'success'}
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="flex items-center text-red-400 text-sm" role="alert">
              <AlertCircleIcon className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {status === 'success' && (
            <div className="flex items-center text-emerald-400 text-sm" role="status">
              <CheckCircleIcon className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>{message}</span>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={status === 'loading' || status === 'success'}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {status === 'loading' ? (
                <Loader2Icon className="w-5 h-5 animate-spin" />
              ) : (
                'Send Reset Link'
              )}
            </button>
          </div>
        </form>

        {status === 'success' && (
          <div className="text-center">
            <p className="text-sm text-zinc-400">
              Didn't receive the email?{' '}
              <button
                onClick={() => setStatus('idle')}
                className="font-medium text-green-400 hover:text-green-300"
              >
                Try again
              </button>
            </p>
            <p className="mt-4 text-sm text-zinc-400">
              <button
                onClick={handleBackToLogin}
                className="font-medium text-green-400 hover:text-green-300"
              >
                ← Back to Login
              </button>
            </p>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}