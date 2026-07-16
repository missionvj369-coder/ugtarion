import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SectionWrapper from './SectionWrapper';
import { confirmPasswordReset } from '../lib/apiClient';
import { ArrowLeftIcon, LockIcon, AlertCircleIcon, CheckCircleIcon, Loader2Icon, EyeIcon, EyeOffIcon } from './icons';

interface PasswordResetConfirmProps {
  onBackToLogin: () => void;
}

export function PasswordResetConfirm({ onBackToLogin }: PasswordResetConfirmProps) {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [tokenValid, setTokenValid] = useState(true);

  const validatePassword = (pwd: string): string | null => {
    if (pwd.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(pwd)) return 'Password must contain at least one uppercase letter';
    if (!/[a-z]/.test(pwd)) return 'Password must contain at least one lowercase letter';
    if (!/[0-9]/.test(pwd)) return 'Password must contain at least one number';
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) return 'Password must contain at least one special character';
    return null;
  };

  const validateConfirmPassword = (pwd: string, confirm: string): string | null => {
    if (pwd !== confirm) return 'Passwords do not match';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    const confirmError = validateConfirmPassword(password, confirmPassword);
    if (confirmError) {
      setError(confirmError);
      return;
    }

    if (!token) {
      setError('Invalid or missing reset token');
      setTokenValid(false);
      return;
    }

    setStatus('loading');

    try {
      const response = await confirmPasswordReset(token, password);
      setStatus('success');
      setMessage(response.message || 'Password has been successfully reset. Please log in with your new password.');
    } catch (err: any) {
      setStatus('error');
      setTokenValid(false);
      setError(err.message || 'Invalid or expired reset token. Please request a new password reset link.');
    }
  };

  // Validate token on mount
  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      setError('Invalid or missing reset token. Please request a new password reset link.');
    }
  }, [token]);

  return (
    <SectionWrapper className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <button
            onClick={onBackToLogin}
            className="absolute left-0 top-0 flex items-center text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Back to login"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span className="ml-1 text-sm">Back to Login</span>
          </button>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Reset your password</h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your new password below. Make sure it's strong and unique.
          </p>
        </div>

        {!tokenValid && (
          <div className="text-center">
            <div className="flex items-center text-red-600 text-sm justify-center" role="alert">
              <AlertCircleIcon className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>{error || 'Invalid or expired reset token. Please request a new password reset link.'}</span>
            </div>
            <div className="mt-4 text-center">
              <button
                onClick={onBackToLogin}
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                ← Back to Login
              </button>
              <p className="mt-2 text-sm text-gray-600">
                <button
                  onClick={onBackToLogin}
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Request a new reset link
                </button>
              </p>
            </div>
          </div>
        )}

        {tokenValid && (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="password" className="sr-only">
                  New password
                </label>
                <div className="relative">
                  <LockIcon className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 w-5 h-5" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none relative block w-full pl-10 pr-12 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="New password"
                    disabled={status === 'loading' || status === 'success'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div>
                <label htmlFor="confirmPassword" className="sr-only">
                  Confirm new password
                </label>
                <div className="relative">
                  <LockIcon className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 w-5 h-5" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="appearance-none relative block w-full pl-10 pr-12 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Confirm new password"
                    disabled={status === 'loading' || status === 'success'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center text-red-600 text-sm" role="alert">
                <AlertCircleIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {status === 'success' && (
              <div className="flex items-center text-green-600 text-sm" role="status">
                <CheckCircleIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>{message}</span>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={status === 'loading' || status === 'success'}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {status === 'loading' ? (
                  <Loader2Icon className="w-5 h-5 animate-spin" />
                ) : (
                  'Reset Password'
                )}
              </button>
            </div>
          </form>
        )}

        {status === 'success' && (
          <div className="text-center">
            <p className="mt-4 text-sm text-gray-600">
              <button
                onClick={onBackToLogin}
                className="font-medium text-indigo-600 hover:text-indigo-500"
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